-- Schema creation for Sunnova Pro

-- Remove: DROP SCHEMA mobile CASCADE;
-- ALTER TABLE mobile.users ADD profile_picture character varying(200);

CREATE SCHEMA mobile;
CREATE TYPE lead_type AS ENUM ('converted', 'existing', 'partial');

CREATE TABLE mobile.leads (
    id SERIAL PRIMARY KEY,

    -- primary contact
    firstname character varying(40),
    middlename character varying(80),
    lastname character varying(80),
    email character varying(80),
    phone character varying(40),

    -- solar address
    street character varying(255),
    city character varying(40),
    postalcode character varying(20),
    country character varying(80),
    state character varying(80),
    deleted boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    address_lat float,
    address_lng float,

    -- eligibility
    owner character varying(20),

    -- electricity provider
    genability_account_id character varying(50),
    electricity_provider character varying(50),
    electricity_plan character varying(50),
    electricity_january integer,
    electricity_multiplier real,
    electricity_yearly integer,

    -- new fields
    flagged boolean,
    canceled boolean,
    testing boolean,
    type lead_type,
    user_id integer
);

CREATE TABLE mobile.contacts (
    id SERIAL PRIMARY KEY,
    lead_id integer,
    firstname character varying(40),
    middlename character varying(80),
    lastname character varying(80),
    email character varying(80),
    phone character varying(40),
    phone_prefix character varying(10),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

CREATE TYPE partner_status_type AS ENUM ('Active Partner', 'Inactive Partner', 'Pending Partner', 'Terminated Partner', 'Suspended Partner', 'DNQ', 'Active Prospect', 'Suspended Prospect', 'Prospect');
CREATE TYPE entity_type AS ENUM ('Individial/Sole Proprietor', 'LLC/PLLC', 'Corporation', 'Partnership', 'LLP');
CREATE TABLE mobile.companies (
    id SERIAL PRIMARY KEY,
    name character varying(80),
    legal_name character varying(200),
    website character varying(200),
    partner_status partner_status_type,
    entity_type entity_type,
    state_of_formation character varying(50),
    installation_warranty integer,
    logo_url character varying(200),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

 -- Solar consultants which can log in or be assigned in lead creation
CREATE TABLE mobile.users (
    id SERIAL PRIMARY KEY,

    firstname character varying(40),
    middlename character varying(80),
    lastname character varying(80),
    email character varying(80),
    password character varying(200),
    salt character varying(200),
    authy_id integer,
    phone character varying(40),
    phone_prefix character varying(10),
    profile_picture character varying(200),
    company_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

CREATE TABLE mobile.tutorial_tips (
    user_id integer PRIMARY KEY,

    flag boolean
);

CREATE TABLE mobile.solar_arrays (
    id integer PRIMARY KEY,
    lead_id integer,
    number_of_modules integer,
    rotation float,
    tilt float,
);

CREATE TABLE mobile.lead_electricity_bills (
    lead_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    value FLOAT NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY(lead_id, month, year)
);
