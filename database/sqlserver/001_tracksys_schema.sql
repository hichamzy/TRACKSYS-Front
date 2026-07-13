/* =====================================================================
   TRACKSYS — Schéma SQL Server (données métier relationnelles)
   Backend : .NET 8 / ASP.NET Core Identity + JWT
   Les positions GPS brutes et l'historique de trajets (PostGIS) sont
   gérés dans une base PostgreSQL séparée — hors scope de ce script.
   ===================================================================== */

SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF DB_ID(N'TracksysDb') IS NULL
BEGIN
    CREATE DATABASE TracksysDb;
END
GO

USE TracksysDb;
GO

IF SCHEMA_ID(N'identity') IS NULL EXEC(N'CREATE SCHEMA identity');
IF SCHEMA_ID(N'fleet')    IS NULL EXEC(N'CREATE SCHEMA fleet');
IF SCHEMA_ID(N'citizen')  IS NULL EXEC(N'CREATE SCHEMA citizen');
IF SCHEMA_ID(N'alerting') IS NULL EXEC(N'CREATE SCHEMA alerting');
IF SCHEMA_ID(N'reporting') IS NULL EXEC(N'CREATE SCHEMA reporting');
GO

/* =====================================================================
   1. ASP.NET CORE IDENTITY (schéma identity) — auth JWT
   Tables au format standard Microsoft.AspNetCore.Identity (IdentityDbContext<ApplicationUser>)
   ===================================================================== */

CREATE TABLE identity.AspNetRoles (
    Id               NVARCHAR(450)   NOT NULL,
    Name             NVARCHAR(256)   NULL,
    NormalizedName   NVARCHAR(256)   NULL,
    ConcurrencyStamp NVARCHAR(MAX)   NULL,
    CONSTRAINT PK_AspNetRoles PRIMARY KEY (Id)
);
GO
CREATE UNIQUE INDEX RoleNameIndex ON identity.AspNetRoles (NormalizedName) WHERE NormalizedName IS NOT NULL;
GO

CREATE TABLE identity.AspNetUsers (
    Id                     NVARCHAR(450)   NOT NULL,
    FullName               NVARCHAR(200)   NOT NULL,               -- extension métier (ex. "A. Tarhine")
    Scope                  NVARCHAR(200)   NULL,                   -- périmètre affiché, ex. "Anfa · Maârif" (pas de relation pour l'instant)
    IsActive               BIT             NOT NULL CONSTRAINT DF_AspNetUsers_IsActive DEFAULT (1),
    UserName               NVARCHAR(256)   NULL,
    NormalizedUserName     NVARCHAR(256)   NULL,
    Email                  NVARCHAR(256)   NULL,
    NormalizedEmail        NVARCHAR(256)   NULL,
    EmailConfirmed         BIT             NOT NULL CONSTRAINT DF_AspNetUsers_EmailConfirmed DEFAULT (0),
    PasswordHash           NVARCHAR(MAX)   NULL,
    SecurityStamp          NVARCHAR(MAX)   NULL,
    ConcurrencyStamp       NVARCHAR(MAX)   NULL,
    PhoneNumber            NVARCHAR(32)    NULL,
    PhoneNumberConfirmed   BIT             NOT NULL CONSTRAINT DF_AspNetUsers_PhoneConfirmed DEFAULT (0),
    TwoFactorEnabled       BIT             NOT NULL CONSTRAINT DF_AspNetUsers_TwoFactor DEFAULT (0),
    LockoutEnd             DATETIMEOFFSET  NULL,
    LockoutEnabled         BIT             NOT NULL CONSTRAINT DF_AspNetUsers_LockoutEnabled DEFAULT (1),
    AccessFailedCount      INT             NOT NULL CONSTRAINT DF_AspNetUsers_AccessFailedCount DEFAULT (0),
    CreatedAtUtc           DATETIME2(3)    NOT NULL CONSTRAINT DF_AspNetUsers_CreatedAtUtc DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_AspNetUsers PRIMARY KEY (Id)
);
GO
CREATE UNIQUE INDEX UserNameIndex ON identity.AspNetUsers (NormalizedUserName) WHERE NormalizedUserName IS NOT NULL;
CREATE INDEX EmailIndex ON identity.AspNetUsers (NormalizedEmail);
GO

CREATE TABLE identity.AspNetUserRoles (
    UserId NVARCHAR(450) NOT NULL,
    RoleId NVARCHAR(450) NOT NULL,
    CONSTRAINT PK_AspNetUserRoles PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_AspNetUserRoles_User FOREIGN KEY (UserId) REFERENCES identity.AspNetUsers (Id) ON DELETE CASCADE,
    CONSTRAINT FK_AspNetUserRoles_Role FOREIGN KEY (RoleId) REFERENCES identity.AspNetRoles (Id) ON DELETE CASCADE
);
GO

CREATE TABLE identity.AspNetUserClaims (
    Id         INT IDENTITY(1,1) NOT NULL,
    UserId     NVARCHAR(450)     NOT NULL,
    ClaimType  NVARCHAR(MAX)     NULL,
    ClaimValue NVARCHAR(MAX)     NULL,
    CONSTRAINT PK_AspNetUserClaims PRIMARY KEY (Id),
    CONSTRAINT FK_AspNetUserClaims_User FOREIGN KEY (UserId) REFERENCES identity.AspNetUsers (Id) ON DELETE CASCADE
);
GO

CREATE TABLE identity.AspNetRoleClaims (
    Id         INT IDENTITY(1,1) NOT NULL,
    RoleId     NVARCHAR(450)     NOT NULL,
    ClaimType  NVARCHAR(MAX)     NULL,
    ClaimValue NVARCHAR(MAX)     NULL,
    CONSTRAINT PK_AspNetRoleClaims PRIMARY KEY (Id),
    CONSTRAINT FK_AspNetRoleClaims_Role FOREIGN KEY (RoleId) REFERENCES identity.AspNetRoles (Id) ON DELETE CASCADE
);
GO

CREATE TABLE identity.AspNetUserLogins (
    LoginProvider       NVARCHAR(450) NOT NULL,
    ProviderKey          NVARCHAR(450) NOT NULL,
    ProviderDisplayName  NVARCHAR(MAX) NULL,
    UserId               NVARCHAR(450) NOT NULL,
    CONSTRAINT PK_AspNetUserLogins PRIMARY KEY (LoginProvider, ProviderKey),
    CONSTRAINT FK_AspNetUserLogins_User FOREIGN KEY (UserId) REFERENCES identity.AspNetUsers (Id) ON DELETE CASCADE
);
GO

CREATE TABLE identity.AspNetUserTokens (
    UserId        NVARCHAR(450) NOT NULL,
    LoginProvider NVARCHAR(450) NOT NULL,
    Name          NVARCHAR(450) NOT NULL,
    Value         NVARCHAR(MAX) NULL,
    CONSTRAINT PK_AspNetUserTokens PRIMARY KEY (UserId, LoginProvider, Name),
    CONSTRAINT FK_AspNetUserTokens_User FOREIGN KEY (UserId) REFERENCES identity.AspNetUsers (Id) ON DELETE CASCADE
);
GO

-- Refresh tokens JWT (rotation) — table applicative, pas Identity standard
CREATE TABLE identity.RefreshTokens (
    Id            BIGINT IDENTITY(1,1) NOT NULL,
    UserId        NVARCHAR(450)  NOT NULL,
    TokenHash     NVARCHAR(256)  NOT NULL,          -- hash du refresh token (jamais le token en clair)
    ExpiresAtUtc  DATETIME2(3)   NOT NULL,
    CreatedAtUtc  DATETIME2(3)   NOT NULL CONSTRAINT DF_RefreshTokens_CreatedAtUtc DEFAULT (SYSUTCDATETIME()),
    RevokedAtUtc  DATETIME2(3)   NULL,
    ReplacedByTokenHash NVARCHAR(256) NULL,
    CreatedByIp   NVARCHAR(64)   NULL,
    CONSTRAINT PK_RefreshTokens PRIMARY KEY (Id),
    CONSTRAINT FK_RefreshTokens_User FOREIGN KEY (UserId) REFERENCES identity.AspNetUsers (Id) ON DELETE CASCADE
);
GO
CREATE INDEX IX_RefreshTokens_UserId ON identity.RefreshTokens (UserId);
CREATE UNIQUE INDEX UX_RefreshTokens_TokenHash ON identity.RefreshTokens (TokenHash);
GO

/* =====================================================================
   2. RÉFÉRENTIELS FLOTTE (schéma fleet)
   ===================================================================== */

CREATE TABLE fleet.VehicleTypes (
    Id    INT IDENTITY(1,1) NOT NULL,
    Label NVARCHAR(100) NOT NULL,          -- "Benne 12 m³", "Ampliroll", "Laveuse voirie"...
    CONSTRAINT PK_VehicleTypes PRIMARY KEY (Id),
    CONSTRAINT UQ_VehicleTypes_Label UNIQUE (Label)
);
GO

CREATE TABLE fleet.VehicleStatuses (
    Code  VARCHAR(10)  NOT NULL,           -- 'active' | 'idle' | 'off'
    Label NVARCHAR(50) NOT NULL,           -- "En tournée", "À l'arrêt", "Hors service"
    CONSTRAINT PK_VehicleStatuses PRIMARY KEY (Code)
);
GO

CREATE TABLE fleet.Drivers (
    Id            INT IDENTITY(1,1) NOT NULL,
    FullName      NVARCHAR(150)  NOT NULL,
    Phone         NVARCHAR(32)   NULL,
    LicenceNumber NVARCHAR(50)   NULL,
    LicenceValid  BIT            NOT NULL CONSTRAINT DF_Drivers_LicenceValid DEFAULT (1),
    Status        NVARCHAR(30)   NOT NULL CONSTRAINT DF_Drivers_Status DEFAULT (N'En service'), -- "En service" | "Repos" | "Absent"
    ApplicationUserId NVARCHAR(450) NULL,  -- si le chauffeur a un compte de connexion
    CreatedAtUtc  DATETIME2(3)   NOT NULL CONSTRAINT DF_Drivers_CreatedAtUtc DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Drivers PRIMARY KEY (Id),
    CONSTRAINT FK_Drivers_ApplicationUser FOREIGN KEY (ApplicationUserId) REFERENCES identity.AspNetUsers (Id) ON DELETE SET NULL
);
GO

CREATE TABLE fleet.Vehicles (
    Id              INT IDENTITY(1,1) NOT NULL,
    Code            VARCHAR(20)    NOT NULL,       -- "BN-02", identifiant métier affiché
    PlateNumber     VARCHAR(20)    NOT NULL,
    VehicleTypeId   INT            NOT NULL,
    DriverId        INT            NULL,
    StatusCode      VARCHAR(10)    NOT NULL CONSTRAINT DF_Vehicles_StatusCode DEFAULT ('idle'),
    Zone            NVARCHAR(100)  NULL,           -- libellé libre, ex. "Anfa" (pas de table Zones pour l'instant)
    ImeiTracker     VARCHAR(50)    NULL,            -- balise GPS, ex. "FMC650·8671"
    SpeedKmh        DECIMAL(6,2)   NOT NULL CONSTRAINT DF_Vehicles_SpeedKmh DEFAULT (0),
    DistanceTodayKm DECIMAL(8,2)   NOT NULL CONSTRAINT DF_Vehicles_DistanceTodayKm DEFAULT (0),
    DriveTimeToday  VARCHAR(20)    NULL,             -- "4 h 05" (affichage) — calculable côté service si besoin
    LastStopLabel   VARCHAR(20)    NULL,             -- "6 min" (affichage)
    LastKnownLat    DECIMAL(9,6)   NULL,             -- cache de la dernière position connue (source de vérité : PostgreSQL/PostGIS)
    LastKnownLng    DECIMAL(9,6)   NULL,
    LastPositionAtUtc DATETIME2(3) NULL,
    CreatedAtUtc    DATETIME2(3)   NOT NULL CONSTRAINT DF_Vehicles_CreatedAtUtc DEFAULT (SYSUTCDATETIME()),
    UpdatedAtUtc    DATETIME2(3)   NULL,
    CONSTRAINT PK_Vehicles PRIMARY KEY (Id),
    CONSTRAINT UQ_Vehicles_Code UNIQUE (Code),
    CONSTRAINT UQ_Vehicles_PlateNumber UNIQUE (PlateNumber),
    CONSTRAINT FK_Vehicles_VehicleType FOREIGN KEY (VehicleTypeId) REFERENCES fleet.VehicleTypes (Id),
    CONSTRAINT FK_Vehicles_Driver FOREIGN KEY (DriverId) REFERENCES fleet.Drivers (Id) ON DELETE SET NULL,
    CONSTRAINT FK_Vehicles_Status FOREIGN KEY (StatusCode) REFERENCES fleet.VehicleStatuses (Code)
);
GO
CREATE INDEX IX_Vehicles_StatusCode ON fleet.Vehicles (StatusCode);
CREATE INDEX IX_Vehicles_DriverId ON fleet.Vehicles (DriverId);
GO

ALTER TABLE fleet.Drivers ADD CurrentVehicleId INT NULL
    CONSTRAINT FK_Drivers_CurrentVehicle FOREIGN KEY REFERENCES fleet.Vehicles (Id) ON DELETE SET NULL;
GO

/* =====================================================================
   3. RÉCLAMATIONS CITOYENNES (schéma citizen)
   ===================================================================== */

CREATE TABLE citizen.ComplaintCategories (
    Id           INT IDENTITY(1,1) NOT NULL,
    Label        NVARCHAR(100)  NOT NULL,       -- "Dépôt sauvage", "Bac endommagé"...
    Icon         NVARCHAR(10)   NULL,           -- emoji d'illustration
    DefaultPrio  VARCHAR(10)    NOT NULL,       -- 'Haute' | 'Moyenne' | 'Basse'
    SlaHours     INT            NOT NULL,       -- délai cible en heures (4, 24, 12, 72...)
    IsActive     BIT            NOT NULL CONSTRAINT DF_ComplaintCategories_IsActive DEFAULT (1),
    CONSTRAINT PK_ComplaintCategories PRIMARY KEY (Id),
    CONSTRAINT UQ_ComplaintCategories_Label UNIQUE (Label),
    CONSTRAINT CK_ComplaintCategories_Prio CHECK (DefaultPrio IN ('Haute','Moyenne','Basse'))
);
GO

CREATE TABLE citizen.ComplaintStatuses (
    Code VARCHAR(10)  NOT NULL,               -- 'received' | 'inprogress' | 'resolved'
    Label NVARCHAR(30) NOT NULL,              -- "Reçue", "En cours", "Résolue"
    SortOrder TINYINT NOT NULL,
    CONSTRAINT PK_ComplaintStatuses PRIMARY KEY (Code)
);
GO

CREATE TABLE citizen.Complaints (
    Id             INT IDENTITY(1,1) NOT NULL,
    Code           VARCHAR(20)    NOT NULL,        -- "RC-2087"
    CategoryId     INT            NOT NULL,
    Priority       VARCHAR(10)    NOT NULL,        -- copie modifiable à la création (peut différer du défaut catégorie)
    StatusCode     VARCHAR(10)    NOT NULL CONSTRAINT DF_Complaints_StatusCode DEFAULT ('received'),
    ZoneLabel      NVARCHAR(150)  NOT NULL,        -- "Bd Anfa, Maârif" — adresse affichée
    Lat            DECIMAL(9,6)   NOT NULL,
    Lng            DECIMAL(9,6)   NOT NULL,
    AssignedVehicleId INT         NULL,
    ReporterName   NVARCHAR(100)  NULL,            -- "Anonyme" par défaut côté front
    ReportedAtUtc  DATETIME2(3)   NOT NULL CONSTRAINT DF_Complaints_ReportedAtUtc DEFAULT (SYSUTCDATETIME()),
    ResolvedAtUtc  DATETIME2(3)   NULL,
    PhotoBeforeUrl NVARCHAR(500)  NULL,
    PhotoAfterUrl  NVARCHAR(500)  NULL,
    CreatedAtUtc   DATETIME2(3)   NOT NULL CONSTRAINT DF_Complaints_CreatedAtUtc DEFAULT (SYSUTCDATETIME()),
    UpdatedAtUtc   DATETIME2(3)   NULL,
    CONSTRAINT PK_Complaints PRIMARY KEY (Id),
    CONSTRAINT UQ_Complaints_Code UNIQUE (Code),
    CONSTRAINT CK_Complaints_Priority CHECK (Priority IN ('Haute','Moyenne','Basse')),
    CONSTRAINT FK_Complaints_Category FOREIGN KEY (CategoryId) REFERENCES citizen.ComplaintCategories (Id),
    CONSTRAINT FK_Complaints_Status FOREIGN KEY (StatusCode) REFERENCES citizen.ComplaintStatuses (Code),
    CONSTRAINT FK_Complaints_Vehicle FOREIGN KEY (AssignedVehicleId) REFERENCES fleet.Vehicles (Id) ON DELETE SET NULL
);
GO
CREATE INDEX IX_Complaints_StatusCode ON citizen.Complaints (StatusCode);
CREATE INDEX IX_Complaints_CategoryId ON citizen.Complaints (CategoryId);
CREATE INDEX IX_Complaints_AssignedVehicleId ON citizen.Complaints (AssignedVehicleId);
GO

-- Timeline de suivi (Reçue → En cours → Résolue), historise chaque changement de statut
CREATE TABLE citizen.ComplaintStatusHistory (
    Id            BIGINT IDENTITY(1,1) NOT NULL,
    ComplaintId   INT            NOT NULL,
    StatusCode    VARCHAR(10)    NOT NULL,
    ChangedAtUtc  DATETIME2(3)   NOT NULL CONSTRAINT DF_ComplaintStatusHistory_ChangedAtUtc DEFAULT (SYSUTCDATETIME()),
    ChangedByUserId NVARCHAR(450) NULL,
    CONSTRAINT PK_ComplaintStatusHistory PRIMARY KEY (Id),
    CONSTRAINT FK_ComplaintStatusHistory_Complaint FOREIGN KEY (ComplaintId) REFERENCES citizen.Complaints (Id) ON DELETE CASCADE,
    CONSTRAINT FK_ComplaintStatusHistory_Status FOREIGN KEY (StatusCode) REFERENCES citizen.ComplaintStatuses (Code),
    CONSTRAINT FK_ComplaintStatusHistory_User FOREIGN KEY (ChangedByUserId) REFERENCES identity.AspNetUsers (Id) ON DELETE SET NULL
);
GO
CREATE INDEX IX_ComplaintStatusHistory_ComplaintId ON citizen.ComplaintStatusHistory (ComplaintId);
GO

/* =====================================================================
   4. ALERTES & RÈGLES (schéma alerting)
   ===================================================================== */

CREATE TABLE alerting.AlertTypes (
    Code     VARCHAR(20)  NOT NULL,          -- 'speed' | 'stop' | 'idle' | 'brake' | 'gps' | 'battery' | 'hours' | 'maint'
    Label    NVARCHAR(100) NOT NULL,         -- "Excès de vitesse"...
    Severity VARCHAR(2)   NOT NULL,          -- 'hi' | 'md' | 'lo'
    CONSTRAINT PK_AlertTypes PRIMARY KEY (Code),
    CONSTRAINT CK_AlertTypes_Severity CHECK (Severity IN ('hi','md','lo'))
);
GO

CREATE TABLE alerting.NotificationChannels (
    Code        VARCHAR(20)   NOT NULL,      -- 'app' | 'mail' | 'sms' | 'daily'
    Name        NVARCHAR(150) NOT NULL,
    Description NVARCHAR(300) NULL,
    IsEnabled   BIT           NOT NULL CONSTRAINT DF_NotificationChannels_IsEnabled DEFAULT (1),
    CONSTRAINT PK_NotificationChannels PRIMARY KEY (Code)
);
GO

CREATE TABLE alerting.AlertRules (
    Id          INT IDENTITY(1,1) NOT NULL,
    AlertTypeCode VARCHAR(20)  NOT NULL,
    IsEnabled   BIT            NOT NULL CONSTRAINT DF_AlertRules_IsEnabled DEFAULT (1),
    Threshold   DECIMAL(10,2)  NOT NULL,       -- valeur du seuil (50, 20, 10, 8, 30, 15, 20, 15000...)
    Unit        VARCHAR(10)    NOT NULL,       -- "km/h", "min", "m/s²", "%", "h", "km"
    Description NVARCHAR(300)  NULL,
    UpdatedAtUtc DATETIME2(3)  NULL,
    CONSTRAINT PK_AlertRules PRIMARY KEY (Id),
    CONSTRAINT UQ_AlertRules_AlertTypeCode UNIQUE (AlertTypeCode),
    CONSTRAINT FK_AlertRules_AlertType FOREIGN KEY (AlertTypeCode) REFERENCES alerting.AlertTypes (Code)
);
GO

-- Canaux activés par règle (many-to-many AlertRules <-> NotificationChannels)
CREATE TABLE alerting.AlertRuleChannels (
    AlertRuleId INT         NOT NULL,
    ChannelCode VARCHAR(20) NOT NULL,
    IsEnabled   BIT         NOT NULL CONSTRAINT DF_AlertRuleChannels_IsEnabled DEFAULT (1),
    CONSTRAINT PK_AlertRuleChannels PRIMARY KEY (AlertRuleId, ChannelCode),
    CONSTRAINT FK_AlertRuleChannels_Rule FOREIGN KEY (AlertRuleId) REFERENCES alerting.AlertRules (Id) ON DELETE CASCADE,
    CONSTRAINT FK_AlertRuleChannels_Channel FOREIGN KEY (ChannelCode) REFERENCES alerting.NotificationChannels (Code) ON DELETE CASCADE
);
GO

CREATE TABLE alerting.Alerts (
    Id            BIGINT IDENTITY(1,1) NOT NULL,
    Code          VARCHAR(20)   NOT NULL,        -- "AL-1042"
    AlertTypeCode VARCHAR(20)   NOT NULL,
    VehicleId     INT           NOT NULL,
    DetailText    NVARCHAR(500) NOT NULL,        -- texte complet (le front distingue segments gras côté UI uniquement)
    OccurredAtUtc DATETIME2(3)  NOT NULL CONSTRAINT DF_Alerts_OccurredAtUtc DEFAULT (SYSUTCDATETIME()),
    IsUnread      BIT           NOT NULL CONSTRAINT DF_Alerts_IsUnread DEFAULT (1),
    ReadAtUtc     DATETIME2(3)  NULL,
    ReadByUserId  NVARCHAR(450) NULL,
    CONSTRAINT PK_Alerts PRIMARY KEY (Id),
    CONSTRAINT UQ_Alerts_Code UNIQUE (Code),
    CONSTRAINT FK_Alerts_AlertType FOREIGN KEY (AlertTypeCode) REFERENCES alerting.AlertTypes (Code),
    CONSTRAINT FK_Alerts_Vehicle FOREIGN KEY (VehicleId) REFERENCES fleet.Vehicles (Id),
    CONSTRAINT FK_Alerts_ReadByUser FOREIGN KEY (ReadByUserId) REFERENCES identity.AspNetUsers (Id) ON DELETE SET NULL
);
GO
CREATE INDEX IX_Alerts_VehicleId ON alerting.Alerts (VehicleId);
CREATE INDEX IX_Alerts_IsUnread ON alerting.Alerts (IsUnread);
CREATE INDEX IX_Alerts_OccurredAtUtc ON alerting.Alerts (OccurredAtUtc DESC);
GO

/* =====================================================================
   5. RAPPORTS (schéma reporting)
   ===================================================================== */

CREATE TABLE reporting.ReportTypes (
    Id    INT IDENTITY(1,1) NOT NULL,
    Label NVARCHAR(100) NOT NULL,         -- "Activité de la flotte", "Réclamations citoyennes"...
    CONSTRAINT PK_ReportTypes PRIMARY KEY (Id),
    CONSTRAINT UQ_ReportTypes_Label UNIQUE (Label)
);
GO

CREATE TABLE reporting.SavedReports (
    Id           INT IDENTITY(1,1) NOT NULL,
    ReportTypeId INT            NOT NULL,
    Name         NVARCHAR(200)  NOT NULL,
    PeriodLabel  NVARCHAR(50)   NOT NULL,       -- "Juin 2026", "T2 2026"...
    Format       VARCHAR(10)    NOT NULL,       -- 'XLSX' | 'PDF' | 'CSV'
    FileUrl      NVARCHAR(500)  NULL,
    GeneratedAtUtc DATETIME2(3) NOT NULL CONSTRAINT DF_SavedReports_GeneratedAtUtc DEFAULT (SYSUTCDATETIME()),
    GeneratedByUserId NVARCHAR(450) NULL,
    CONSTRAINT PK_SavedReports PRIMARY KEY (Id),
    CONSTRAINT CK_SavedReports_Format CHECK (Format IN ('XLSX','PDF','CSV')),
    CONSTRAINT FK_SavedReports_ReportType FOREIGN KEY (ReportTypeId) REFERENCES reporting.ReportTypes (Id),
    CONSTRAINT FK_SavedReports_User FOREIGN KEY (GeneratedByUserId) REFERENCES identity.AspNetUsers (Id) ON DELETE SET NULL
);
GO
CREATE INDEX IX_SavedReports_ReportTypeId ON reporting.SavedReports (ReportTypeId);
GO

-- Agrégats mensuels flotte (alimente les graphiques Distance/Résolution du dashboard & rapports)
CREATE TABLE reporting.FleetMonthlyStats (
    Id                INT IDENTITY(1,1) NOT NULL,
    YearMonth         CHAR(7)        NOT NULL,   -- format 'YYYY-MM'
    TotalDistanceKm   DECIMAL(10,2)  NOT NULL CONSTRAINT DF_FleetMonthlyStats_Distance DEFAULT (0),
    ResolutionRatePct DECIMAL(5,2)   NOT NULL CONSTRAINT DF_FleetMonthlyStats_ResoRate DEFAULT (0),
    ToursCompleted    INT            NOT NULL CONSTRAINT DF_FleetMonthlyStats_Tours DEFAULT (0),
    ComplaintsHandled INT            NOT NULL CONSTRAINT DF_FleetMonthlyStats_Complaints DEFAULT (0),
    AvgResponseMinutes INT           NOT NULL CONSTRAINT DF_FleetMonthlyStats_AvgResponse DEFAULT (0),
    CONSTRAINT PK_FleetMonthlyStats PRIMARY KEY (Id),
    CONSTRAINT UQ_FleetMonthlyStats_YearMonth UNIQUE (YearMonth)
);
GO

/* =====================================================================
   6. DONNÉES DE RÉFÉRENCE (seed) — valeurs fixes issues du front
   ===================================================================== */

INSERT INTO fleet.VehicleStatuses (Code, Label) VALUES
    ('active', N'En tournée'),
    ('idle',   N"À l'arrêt"),
    ('off',    N'Hors service');
GO

INSERT INTO fleet.VehicleTypes (Label) VALUES
    (N'Benne 12 m³'), (N'Benne 6 m³'), (N'Ampliroll'), (N'Laveuse voirie'), (N'Véhicule léger');
GO

INSERT INTO citizen.ComplaintStatuses (Code, Label, SortOrder) VALUES
    ('received',   N'Reçue',    1),
    ('inprogress', N'En cours', 2),
    ('resolved',   N'Résolue',  3);
GO

INSERT INTO citizen.ComplaintCategories (Label, Icon, DefaultPrio, SlaHours, IsActive) VALUES
    (N'Dépôt sauvage',           N'🗑️', 'Haute',   4,  1),
    (N'Bac endommagé',           N'♻️', 'Moyenne', 24, 1),
    (N'Collecte manquée',        N'🚛', 'Moyenne', 12, 1),
    (N'Éclairage public',        N'💡', 'Basse',   72, 1),
    (N'Voirie (nid-de-poule)',   N'🕳️', 'Basse',   72, 0);
GO

INSERT INTO alerting.AlertTypes (Code, Label, Severity) VALUES
    ('speed',   N'Excès de vitesse',              'hi'),
    ('stop',    N'Arrêt prolongé',                 'md'),
    ('idle',    N'Moteur au ralenti',               'md'),
    ('brake',   N'Freinage brusque',                'hi'),
    ('gps',     N'Perte de signal GPS',             'hi'),
    ('battery', N'Batterie balise faible',          'lo'),
    ('hours',   N'Circulation hors horaires',       'md'),
    ('maint',   N'Seuil kilométrique atteint',      'lo');
GO

INSERT INTO alerting.NotificationChannels (Code, Name, Description, IsEnabled) VALUES
    ('app',   N'Notification dans la plateforme', N"Badge et centre d'alertes", 1),
    ('mail',  N'E-mail au superviseur',            N'Alertes critiques uniquement', 1),
    ('sms',   N"SMS d'astreinte",                  N'Alertes critiques hors horaires ouvrés', 0),
    ('daily', N"Rapport quotidien d'alertes",       N'Synthèse envoyée chaque matin à 08:00', 1);
GO

INSERT INTO alerting.AlertRules (AlertTypeCode, IsEnabled, Threshold, Unit, Description) VALUES
    ('speed',   1, 50,    'km/h', N'Déclenche si la vitesse dépasse le seuil pendant plus de 10 s'),
    ('stop',    1, 20,    'min',  N'Déclenche si le véhicule reste immobile au-delà du seuil'),
    ('idle',    1, 10,    'min',  N'Moteur tournant véhicule à l’arrêt (surconsommation)'),
    ('brake',   1, 8,     'm/s²', N'Décélération supérieure au seuil (conduite à risque)'),
    ('gps',     1, 30,    'min',  N'Aucune position reçue de la balise au-delà du seuil'),
    ('battery', 1, 15,    '%',    N'Niveau de batterie de la balise sous le seuil'),
    ('hours',   1, 20,    'h',    N'Circulation détectée en dehors de la plage autorisée'),
    ('maint',   1, 15000, 'km',   N'Kilométrage atteint depuis la dernière révision');
GO

INSERT INTO alerting.AlertRuleChannels (AlertRuleId, ChannelCode, IsEnabled)
SELECT r.Id, c.Code, CASE WHEN c.Code IN ('app','mail') THEN 1 ELSE 0 END
FROM alerting.AlertRules r
CROSS JOIN alerting.NotificationChannels c
WHERE c.Code IN ('app','mail','sms');
GO

INSERT INTO reporting.ReportTypes (Label) VALUES
    (N'Activité de la flotte'),
    (N'Réclamations citoyennes'),
    (N'Tournées & trajets'),
    (N'KPI communal (synthèse)');
GO

/* =====================================================================
   7. RÔLES APPLICATIFS (seed Identity) — correspond aux rôles vus dans le front
   Les mots de passe/utilisateurs concrets sont créés via le backend (UserManager),
   pas en clair dans ce script.
   ===================================================================== */

INSERT INTO identity.AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) VALUES
    (NEWID(), N'Superviseur',       N'SUPERVISEUR',       NEWID()),
    (NEWID(), N'AgentTraitement',   N'AGENTTRAITEMENT',   NEWID()),
    (NEWID(), N'ExploitantFlotte',  N'EXPLOITANTFLOTTE',  NEWID()),
    (NEWID(), N'Administrateur',    N'ADMINISTRATEUR',    NEWID());
GO
