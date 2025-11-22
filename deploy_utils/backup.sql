--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credentials (
    key_id integer NOT NULL,
    login character varying(50) NOT NULL,
    password character varying(256) NOT NULL,
    access_right character varying(20),
    user_id integer NOT NULL
);


ALTER TABLE public.credentials OWNER TO postgres;

--
-- Name: credentials_key_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credentials_key_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credentials_key_id_seq OWNER TO postgres;

--
-- Name: credentials_key_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credentials_key_id_seq OWNED BY public.credentials.key_id;


--
-- Name: dislike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dislike (
    id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.dislike OWNER TO postgres;

--
-- Name: dislike_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dislike_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dislike_id_seq OWNER TO postgres;

--
-- Name: dislike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dislike_id_seq OWNED BY public.dislike.id;


--
-- Name: gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender (
    gender_id integer NOT NULL,
    name character varying
);


ALTER TABLE public.gender OWNER TO postgres;

--
-- Name: gender_gender_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gender_gender_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gender_gender_id_seq OWNER TO postgres;

--
-- Name: gender_gender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gender_gender_id_seq OWNED BY public.gender.gender_id;


--
-- Name: interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interest (
    interest_id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.interest OWNER TO postgres;

--
-- Name: interest_interest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interest_interest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interest_interest_id_seq OWNER TO postgres;

--
-- Name: interest_interest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interest_interest_id_seq OWNED BY public.interest.interest_id;


--
-- Name: like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."like" (
    id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public."like" OWNER TO postgres;

--
-- Name: like_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.like_id_seq OWNER TO postgres;

--
-- Name: like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.like_id_seq OWNED BY public."like".id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    match_id integer NOT NULL,
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    created_at date,
    archived boolean,
    comment text
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- Name: matches_match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matches_match_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_match_id_seq OWNER TO postgres;

--
-- Name: matches_match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matches_match_id_seq OWNED BY public.matches.match_id;


--
-- Name: meeting_feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meeting_feedbacks (
    feedback_id integer NOT NULL,
    meeting_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text NOT NULL,
    was_successful boolean NOT NULL,
    stay_together boolean,
    partner_late boolean,
    created_at timestamp with time zone
);


ALTER TABLE public.meeting_feedbacks OWNER TO postgres;

--
-- Name: meeting_feedbacks_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.meeting_feedbacks_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meeting_feedbacks_feedback_id_seq OWNER TO postgres;

--
-- Name: meeting_feedbacks_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.meeting_feedbacks_feedback_id_seq OWNED BY public.meeting_feedbacks.feedback_id;


--
-- Name: meetings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meetings (
    meeting_id integer NOT NULL,
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    meeting_date timestamp with time zone NOT NULL,
    location character varying(100),
    result character varying(50),
    user1_comment text,
    user2_comment text,
    archived boolean,
    created_at timestamp with time zone
);


ALTER TABLE public.meetings OWNER TO postgres;

--
-- Name: meetings_meeting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.meetings_meeting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meetings_meeting_id_seq OWNER TO postgres;

--
-- Name: meetings_meeting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.meetings_meeting_id_seq OWNED BY public.meetings.meeting_id;


--
-- Name: partner_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_preferences (
    preference_id integer NOT NULL,
    user_id integer NOT NULL,
    min_age integer,
    max_age integer,
    min_height integer,
    max_height integer,
    min_weight integer,
    max_weight integer,
    gender_id integer NOT NULL
);


ALTER TABLE public.partner_preferences OWNER TO postgres;

--
-- Name: partner_preferences_preference_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partner_preferences_preference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partner_preferences_preference_id_seq OWNER TO postgres;

--
-- Name: partner_preferences_preference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partner_preferences_preference_id_seq OWNED BY public.partner_preferences.preference_id;


--
-- Name: preference_interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preference_interest (
    preference_interest_id integer NOT NULL,
    preference_id integer,
    interest_id integer
);


ALTER TABLE public.preference_interest OWNER TO postgres;

--
-- Name: preference_interest_preference_interest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.preference_interest_preference_interest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.preference_interest_preference_interest_id_seq OWNER TO postgres;

--
-- Name: preference_interest_preference_interest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.preference_interest_preference_interest_id_seq OWNED BY public.preference_interest.preference_interest_id;


--
-- Name: preference_signs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preference_signs (
    id integer NOT NULL,
    preference_id integer NOT NULL,
    sign_id integer NOT NULL
);


ALTER TABLE public.preference_signs OWNER TO postgres;

--
-- Name: preference_signs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.preference_signs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.preference_signs_id_seq OWNER TO postgres;

--
-- Name: preference_signs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.preference_signs_id_seq OWNED BY public.preference_signs.id;


--
-- Name: refusals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refusals (
    refusal_id integer NOT NULL,
    user_id integer NOT NULL,
    refusal_date date,
    reason text,
    other_reason text,
    additional_info text
);


ALTER TABLE public.refusals OWNER TO postgres;

--
-- Name: refusals_refusal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refusals_refusal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refusals_refusal_id_seq OWNER TO postgres;

--
-- Name: refusals_refusal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refusals_refusal_id_seq OWNED BY public.refusals.refusal_id;


--
-- Name: restore_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restore_code (
    id integer NOT NULL,
    creds_id integer,
    code character varying(6) NOT NULL,
    expire_at timestamp with time zone NOT NULL,
    token character varying(256) NOT NULL
);


ALTER TABLE public.restore_code OWNER TO postgres;

--
-- Name: restore_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restore_code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restore_code_id_seq OWNER TO postgres;

--
-- Name: restore_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restore_code_id_seq OWNED BY public.restore_code.id;


--
-- Name: user_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_images (
    user_image_id integer NOT NULL,
    user_id integer,
    image_path character varying
);


ALTER TABLE public.user_images OWNER TO postgres;

--
-- Name: user_images_user_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_images_user_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_images_user_image_id_seq OWNER TO postgres;

--
-- Name: user_images_user_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_images_user_image_id_seq OWNED BY public.user_images.user_image_id;


--
-- Name: user_interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_interest (
    user_interest_id integer NOT NULL,
    user_id integer NOT NULL,
    interest_id integer NOT NULL
);


ALTER TABLE public.user_interest OWNER TO postgres;

--
-- Name: user_interest_user_interest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_interest_user_interest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_interest_user_interest_id_seq OWNER TO postgres;

--
-- Name: user_interest_user_interest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_interest_user_interest_id_seq OWNED BY public.user_interest.user_interest_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    gender integer,
    registration_date date,
    first_name character varying(50),
    last_name character varying(50),
    birth_date date,
    height integer,
    weight integer,
    bio text,
    is_active boolean,
    sign_id integer,
    is_admin boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: zodiac_compatibility; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zodiac_compatibility (
    id integer NOT NULL,
    sign1_id integer,
    sign2_id integer,
    percent integer,
    description text
);


ALTER TABLE public.zodiac_compatibility OWNER TO postgres;

--
-- Name: zodiac_compatibility_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zodiac_compatibility_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zodiac_compatibility_id_seq OWNER TO postgres;

--
-- Name: zodiac_compatibility_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zodiac_compatibility_id_seq OWNED BY public.zodiac_compatibility.id;


--
-- Name: zodiac_prediction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zodiac_prediction (
    id integer NOT NULL,
    sign_id integer,
    prediction text,
    prediction_ua text,
    prediction_date date
);


ALTER TABLE public.zodiac_prediction OWNER TO postgres;

--
-- Name: zodiac_prediction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zodiac_prediction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zodiac_prediction_id_seq OWNER TO postgres;

--
-- Name: zodiac_prediction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zodiac_prediction_id_seq OWNED BY public.zodiac_prediction.id;


--
-- Name: zodiac_sign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zodiac_sign (
    sign_id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.zodiac_sign OWNER TO postgres;

--
-- Name: zodiac_sign_sign_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zodiac_sign_sign_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zodiac_sign_sign_id_seq OWNER TO postgres;

--
-- Name: zodiac_sign_sign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zodiac_sign_sign_id_seq OWNED BY public.zodiac_sign.sign_id;


--
-- Name: credentials key_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials ALTER COLUMN key_id SET DEFAULT nextval('public.credentials_key_id_seq'::regclass);


--
-- Name: dislike id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dislike ALTER COLUMN id SET DEFAULT nextval('public.dislike_id_seq'::regclass);


--
-- Name: gender gender_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender ALTER COLUMN gender_id SET DEFAULT nextval('public.gender_gender_id_seq'::regclass);


--
-- Name: interest interest_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest ALTER COLUMN interest_id SET DEFAULT nextval('public.interest_interest_id_seq'::regclass);


--
-- Name: like id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like" ALTER COLUMN id SET DEFAULT nextval('public.like_id_seq'::regclass);


--
-- Name: matches match_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches ALTER COLUMN match_id SET DEFAULT nextval('public.matches_match_id_seq'::regclass);


--
-- Name: meeting_feedbacks feedback_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meeting_feedbacks ALTER COLUMN feedback_id SET DEFAULT nextval('public.meeting_feedbacks_feedback_id_seq'::regclass);


--
-- Name: meetings meeting_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings ALTER COLUMN meeting_id SET DEFAULT nextval('public.meetings_meeting_id_seq'::regclass);


--
-- Name: partner_preferences preference_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_preferences ALTER COLUMN preference_id SET DEFAULT nextval('public.partner_preferences_preference_id_seq'::regclass);


--
-- Name: preference_interest preference_interest_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_interest ALTER COLUMN preference_interest_id SET DEFAULT nextval('public.preference_interest_preference_interest_id_seq'::regclass);


--
-- Name: preference_signs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_signs ALTER COLUMN id SET DEFAULT nextval('public.preference_signs_id_seq'::regclass);


--
-- Name: refusals refusal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refusals ALTER COLUMN refusal_id SET DEFAULT nextval('public.refusals_refusal_id_seq'::regclass);


--
-- Name: restore_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restore_code ALTER COLUMN id SET DEFAULT nextval('public.restore_code_id_seq'::regclass);


--
-- Name: user_images user_image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_images ALTER COLUMN user_image_id SET DEFAULT nextval('public.user_images_user_image_id_seq'::regclass);


--
-- Name: user_interest user_interest_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interest ALTER COLUMN user_interest_id SET DEFAULT nextval('public.user_interest_user_interest_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: zodiac_compatibility id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_compatibility ALTER COLUMN id SET DEFAULT nextval('public.zodiac_compatibility_id_seq'::regclass);


--
-- Name: zodiac_prediction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_prediction ALTER COLUMN id SET DEFAULT nextval('public.zodiac_prediction_id_seq'::regclass);


--
-- Name: zodiac_sign sign_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_sign ALTER COLUMN sign_id SET DEFAULT nextval('public.zodiac_sign_sign_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.alembic_version VALUES ('53a6825ba3bc');


--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.credentials VALUES (5, 'user2@example.com', 'scrypt:32768:8:1$5LOL4zSND97Hu7PU$35f871a08c742a47f90c18cc31796861962988f478db68e577b619458c4a4caa95443f5ef1b9363a9b4be4d2252a2243a497b2ab23245d0895549a42954c2eb1', 'authorized', 5);
INSERT INTO public.credentials VALUES (6, 'user4цв@example.com', 'scrypt:32768:8:1$LQgbBh4EAHAdsYZW$f36f5b0e1b00ebdc0fa314624e5ff6de5e24ea2c27f366ec1b1fa8ebb7618afd0b949e36c8a58bfc427eb29b00fa55578dedb9429972f94714beb31ead257409', 'authorized', 6);
INSERT INTO public.credentials VALUES (7, 'user4@example.com', 'scrypt:32768:8:1$XPUnfrXb0tPHcCUu$fb715e655bb4e8646349ec746f8047f5184bfad8029ab039c1c79dd261f06def382ca737000298d34d53191c2647f0a7ff9d72c4e92b95c4bebd70d89ab3233e', 'authorized', 7);
INSERT INTO public.credentials VALUES (27, 'user24@example.com', 'scrypt:32768:8:1$392XXQhldtQi5knO$52da8b85ba73d7d5317c79d4cd56bbf3582f220888effbabab6a084df357a6457cb3af41533925ceca421ce425999a2161216f27e1eaf78c2d20adb5aaf69554', 'authorized', 27);
INSERT INTO public.credentials VALUES (26, 'user23@example.com', 'scrypt:32768:8:1$yNTvvLQ7f4NBnpRS$e20093a13f3f08259d2cd2bd6147a11bdf9ae3bb9729427007289472b702aee3bccaceb02f30f013bf4ea80401f0af17889b6b2dde1bcf7b56735b42a4d61fdc', 'authorized', 26);
INSERT INTO public.credentials VALUES (109, 'artemiybratko004@gmail.com', 'scrypt:32768:8:1$UeHG9uzBP16QsW7C$b905514caf71bf4a46ac1d233aebc6131c689e0d16b2a1baf3fe269033002b3ae4b4d892ae1c8437192a87942cdbd4c2da9e173fb02b1ee3e2a390cb2df383e8', 'authorized', 109);
INSERT INTO public.credentials VALUES (2, 'bananbka0.2@gmail.com', 'scrypt:32768:8:1$9zM6soMf5hUwHGHP$f9c47d2a0438182afe44198c2b08a8829e0446557d49bb41ab8e156a8965b8fadfcc5dedc6a773c347c33022555cda4148fd5b17440b275868f8eb8bb16c8580', 'operator', 2);
INSERT INTO public.credentials VALUES (4, 'user1@example.com', 'scrypt:32768:8:1$gSEo7TxyQpLl3FsM$9929a08f281bc7061981aa974a04d0d3cf72f6d3284cf4770cb9b480a17fe04dbd19508163055f986de8759336b6aa6399e00462a6e9ca138586220686733557', 'guest', 4);
INSERT INTO public.credentials VALUES (14, 'user11@example.com', 'scrypt:32768:8:1$p1EDBQaiTaIj5ZbP$172ea0126e3dac7b0513158aa81e062167264d098b710282dbf6e4507337117a6246936feb2e2f0cd92971a97dbed9f57e7c631b5ac26f1b0220cfad5a26fd7b', 'authorized', 14);
INSERT INTO public.credentials VALUES (31, 'user28@example.com', 'scrypt:32768:8:1$e1Ms0eRom3cdhtrs$621bca95128498a4cc91bd4facd7a9b727f4285313318e15286237418fd91545fdbab3dc29d300ba142fcd2ed3e911253be0c00ce9e998e8383b86c3db6b3248', 'authorized', 31);
INSERT INTO public.credentials VALUES (32, 'user29@example.com', 'scrypt:32768:8:1$ZDFBimmi9FqnvbYA$458fc6d12c5f6c16537ffcbc46d2ceb95d63b1e71eb878b75cc9d4ef9817668a913ca92b683a0f2b96338c44883db47f0d815c0310ce6263f452747cd1472d4c', 'authorized', 32);
INSERT INTO public.credentials VALUES (24, 'user21@example.com', 'scrypt:32768:8:1$47IyJFA8rRiItqcx$ee7e611ee61f488b23b3d4716bc64ddf5b54d7a205045d7cd3942b9d44b424470fa9f00df3ee4c0a0ff2510f1120b0819ea098f37bbed4a50d0038dbbbc18cfb', 'authorized', 24);
INSERT INTO public.credentials VALUES (3, 'use00r@example.com', 'scrypt:32768:8:1$vbgz5hd2iIvP0cF7$af539d4c26eaf29151bf0c2e94d7997c64f90578ffb6281fa005f31ecef2b0e3db09bfa9b188ebd18feb9fef4474ae85a64323da2216b822299ec7d20479c6ed', 'authorized', 3);
INSERT INTO public.credentials VALUES (110, 'kberegovoj17@gmail.com', 'scrypt:32768:8:1$qXFKrLrrsr95dsjn$cfd48a464a8fc2288153dc72f0054e27bed5f21f0aee982b7ba3eff67b9a3006da894b4b999a8c9a08996b541e2f9fbea4a13d9108df54d930e1dc30d3cbdd7b', 'authorized', 110);
INSERT INTO public.credentials VALUES (115, 'bananbka0.4@gmail.com', 'scrypt:32768:8:1$o3Z6dCaXTtz9hrsz$18db9feb45fb7d7af6f498b2153127cd3e623006cea7e5604bccbcf2be0898ecf256037d299d5d3179e4a0116767fdbd21f3906d8a24f857a4db80a1b884db13', 'authorized', 115);
INSERT INTO public.credentials VALUES (64, 'user61@example.com', 'scrypt:32768:8:1$B0CRP1n5YK1u9nV5$05e5664e3e8eb461c4fce413446172f2989f303e956bce4bdf3653add26d2edd0b227a10e18101f2707c311b371977d234454417da9247757c67bfdc53ba0639', 'authorized', 64);
INSERT INTO public.credentials VALUES (51, 'user48@example.com', 'scrypt:32768:8:1$kjNzxeqb3uwPjO5n$c9c3b7f367b640e37d265309e955c271c845b305d8c78a8aaf611dec7d1ba9a8ee511318a29072f9f5e950aec7dc3a2f05ac833301be9eb2223458f123340636', 'authorized', 51);
INSERT INTO public.credentials VALUES (65, 'user62@example.com', 'scrypt:32768:8:1$jYGvx4tkV8QctaE9$49ad407445319943efaeda8cb4c39575305009b8be8bdd9b56cfb2743d8eb8b14a79ddbe58072ae64d52e6f3cfdd561718edf9e15f5aae16e61e9646f5a0991b', 'authorized', 65);
INSERT INTO public.credentials VALUES (16, 'user13@example.com', 'scrypt:32768:8:1$mFioIQQnrA2LoIki$6dcec2e938147f60bdb793d9dd40c04f10899884a0dab9b4b841f8f8dcd6a69e4325683ad4eab815b35c64696561726a380f905197076d8297c6cffba5d2faba', 'authorized', 16);
INSERT INTO public.credentials VALUES (67, 'user64@example.com', 'scrypt:32768:8:1$clHxu1c7QQPv3QpS$bb01244245c1f9fa92db14da5e63fff833238600e27ae71c723bc6e41d0e59fcf3069184850cd158c7cfcc08add1687025acf6f028414bb1b6263ec590810374', 'authorized', 67);
INSERT INTO public.credentials VALUES (11, 'user8@example.com', 'scrypt:32768:8:1$sOeafHbxiEZi1dna$d325986b7071e09d1afdbf2b0f3ffe214c3f048f728b835d0d9deeff8f2536a304eeeed32ac6b73bea19cc8730ee04f2f118ce4f691e6ae89e16a9024f5a570f', 'authorized', 11);
INSERT INTO public.credentials VALUES (15, 'user12@example.com', 'scrypt:32768:8:1$7Zoy4T77zwljhCMk$0f8dc33cdf269c014fe26b62adde0f3e792f66aeaf9ca12c611b8a428103263235c195d527181f96412f4870234287d100577265e73b8762af9a566ca79fb00c', 'authorized', 15);
INSERT INTO public.credentials VALUES (17, 'user14@example.com', 'scrypt:32768:8:1$hBUcbEq2HT9piACE$c4e68aa8f8fd9db5a3a328cfa00acb414424517c85d75bee9270e3a092b083fd3ffb5b36ab32ac5d52815c6c387f84a14c7c192b6270e9ee4833dc33794fb338', 'authorized', 17);
INSERT INTO public.credentials VALUES (39, 'user36@example.com', 'scrypt:32768:8:1$UxbnUF2PzcIfQvzc$a059206a20b00857996204d2b2c9c9dc31ad0ebec147fb19f940e9f52163361e77f5a910a84fd688ddb7295d5eee9b7ac77eae5f2ece75665c31ffedb711a7ed', 'authorized', 39);
INSERT INTO public.credentials VALUES (38, 'user35@example.com', 'scrypt:32768:8:1$pvq5qzGSCK4FrI4n$c2553f73b15ff3dc0f58ea55857ba9adfa98d17775754399f8d4fe5b4cb04feeff95926760b8a725c4d6d94a52bbc4f56ff7fa1e7d12cedd98138ac075700f5c', 'authorized', 38);
INSERT INTO public.credentials VALUES (37, 'user34@example.com', 'scrypt:32768:8:1$DnGNoZ60uTgvOBqQ$03fb683b8f7cff6ac5d449a7a17369a4a86160aab450a0a95b538b0f6c071fd40f31fb0c3c782a0065f87bdb5a5b2b7c002870767c40650249f3bf5d8158acc1', 'authorized', 37);
INSERT INTO public.credentials VALUES (35, 'user32@example.com', 'scrypt:32768:8:1$TiAmaQ5GZRsqStMA$6fc81fe2d4f8087869cb1493453768b5d983582fa84a0f2f3bf084d8d25736a1fa108190fe360f31f168dfaf2342df7024a78d2a24a9b22c3bdbfcf55f2028e6', 'authorized', 35);
INSERT INTO public.credentials VALUES (36, 'user33@example.com', 'scrypt:32768:8:1$JwRYpkxWADRaKZQq$f3fe79f6f93d3106c8e9f1a31ce78b0f4169a927bc1a89f89102f0f72d49bad13c33a43dddd7fa6caa7d3c1b3f1a1bffd3b9331b01ce949bca97a9c30bf82e6f', 'authorized', 36);
INSERT INTO public.credentials VALUES (33, 'user30@example.com', 'scrypt:32768:8:1$tzwnMe4qka5Ah4ld$20dfb924e4d37acd6f26b0c23a70bb9e7b8921707052a7f1f6f8826b1a1085de5a93d0fbad6691e65206baa5a2335271cfb3e1c54eaa663299c4fa4fca3e605b', 'authorized', 33);
INSERT INTO public.credentials VALUES (34, 'user31@example.com', 'scrypt:32768:8:1$ZuVEeJIlW8IUKL64$e454b84baecd9eb6e307c510eb180ea4c9f16b80b4fde01b717aefad8cfac4afbe007cdc7940d2570e2f356ca1c26443ee9db81f254c1ef387d357557728271b', 'authorized', 34);
INSERT INTO public.credentials VALUES (22, 'user19@example.com', 'scrypt:32768:8:1$OiawmOEjFdc3YjQv$0b117cdca86250f3359ec5e078ff8d6b52fcf25331c28c784a6a71b136a86f0821f0dad1881d50c4eb86f01a7bbf769cd49799921b3273888ada216c87bc24f3', 'authorized', 22);
INSERT INTO public.credentials VALUES (21, 'user18@example.com', 'scrypt:32768:8:1$lCQndQF10t2E74VY$5db7e9e9c98d624ed84d6579e8b4db4022ba9160733603fd62e6d8733d6a2494557dfd1a016037cd90701dcb85da86b08648d477ac6ab0f786f7985152704e8e', 'authorized', 21);
INSERT INTO public.credentials VALUES (103, 'nikitaz9251015@gmail.com', 'scrypt:32768:8:1$uOHo3yBUShECGbbW$dd2118b791f05cf68cdeb4a6e3aba91451c5543ecb0f91e6993345b8202c803600726fe51d022fa93aabaa5071aba03b2eb8553ce0f9a725f4387f11e80b3647', 'admin', 103);
INSERT INTO public.credentials VALUES (12, 'user9@example.com', 'scrypt:32768:8:1$ocMv0QJ0i8BPzHQY$ff282a62180a06e127465edad6f6496d3c7699521f817570c9669c106b7087c307d44a58079acbcd42c50286c118e58155189a7d08dcc31186ae660aa6ca13c2', 'authorized', 12);
INSERT INTO public.credentials VALUES (20, 'user17@example.com', 'scrypt:32768:8:1$WuqUUE3Tri4c2iPG$4d20ee98d85c66e4a86148fddb2a607f586f74039d0f0046fbe90f84cac3e0baaf46db613a75131a15df418bcaa30e88144fdee7f3fe0196ad24e50b0cc3c09e', 'authorized', 20);
INSERT INTO public.credentials VALUES (28, 'user25@example.com', 'scrypt:32768:8:1$PiqD6uTfKPSYHMb0$7a57026b6c249079d846a086f8ed2df950b58587fb7ddf7777cd843387f432e741142f344e12a48491923bc3cdec14a9674dc0170b936a178aa5c00eef459f06', 'authorized', 28);
INSERT INTO public.credentials VALUES (80, 'user77@example.com', 'scrypt:32768:8:1$3GaWwwd28f9qEaIc$7c53421178469047f077eb42cf97833ae7a377babfe20bdbe4758539b356322bc67e1fda3dab8f623753a8538c8802f9864e62a92aba5a2012a4b48a50d3a0b4', 'authorized', 80);
INSERT INTO public.credentials VALUES (89, 'user86@example.com', 'scrypt:32768:8:1$SXyYUMTYSgkHKhkf$7e630809254f0ea56da869e2f2350598f6b5501ff692874fb059a5007afe542f50ecdbff2fda38042cec2819e32b3134e5d460e1f9fcf1bdcb847efcff1a8de2', 'authorized', 89);
INSERT INTO public.credentials VALUES (79, 'user76@example.com', 'scrypt:32768:8:1$osynL1MzZJk0CTvp$874e088dfd6fb3f344d6d2bd1bebd93c20594cefa99940b4ecccf0be31d92ec3992a326b198919f671c6ca14622242ca86794b77b7be5eb1fb5036a0b3d94e70', 'authorized', 79);
INSERT INTO public.credentials VALUES (44, 'user41@example.com', 'scrypt:32768:8:1$Hcm1OrDRnhA9NX5c$a96942dcac3d5b8a78784587c2ec1e5b25920a682b2e6af4389e7fc2423f3d1fc79b85f9569f5375a368ca2ceb29098e16d43123f0237aa254e70ebeec2b15df', 'authorized', 44);
INSERT INTO public.credentials VALUES (73, 'user70@example.com', 'scrypt:32768:8:1$I9yu8IJu3r2a12ge$5ec8dd7ea27e9ac00eda003de2be8b225ac9518f28196d7465e72ebd815228da69ccdde478544df710d5fd3ec2b0c68223572c0b0c326d28effb714c82152ae0', 'authorized', 73);
INSERT INTO public.credentials VALUES (100, 'user97@example.com', 'scrypt:32768:8:1$XeEVQ5G2YzItf3FN$a760dfde82f0117ba6436efc736d6d75d80d1e5b5f6ed0bbd7000f5a493382fe011fb8723791c0ca8f1c40dafd996fca3ca901d52939719917f1c2024d08d938', 'authorized', 100);
INSERT INTO public.credentials VALUES (99, 'user96@example.com', 'scrypt:32768:8:1$cMm3452h4xIgrcXo$45a9c4c6b6afd49134c79ee04ac1c4f0d712c08833db71870cb65069bf6bd41355534d95c131540fafb543b516b2141d88ba7ef773490daac26bffd1d58830fc', 'authorized', 99);
INSERT INTO public.credentials VALUES (87, 'user84@example.com', 'scrypt:32768:8:1$lLcmSzZevzVlEtwr$f55790b490bfa2e55ff24275ed394af234bb6c2e4aaaedcfd0f95e6b10a29ad7bd8d521bb010eeb49bfe341c8b3f68c5252f9992a28c309ea0b10d6a71516514', 'authorized', 87);
INSERT INTO public.credentials VALUES (81, 'user78@example.com', 'scrypt:32768:8:1$EhyG1HFbCSqQ5ZDl$5a19bfa524054875295a629a7846749ca0300da3e46f86393b49f5308d6e019facf90b71ffc133a8c0b3010a73aaaf1e72df03afc8b8bfc1edf9be2d65112e1b', 'authorized', 81);
INSERT INTO public.credentials VALUES (72, 'user69@example.com', 'scrypt:32768:8:1$vOY1SGcnBD3BHPW7$e928d44e46e8ec245f75b5805591be0650792eef568d9fccbf92cf7eca736940ba6dc32a75752d8c9da0d48ea813234ff01378ea71e748417633f8ab9c837b13', 'authorized', 72);
INSERT INTO public.credentials VALUES (97, 'user94@example.com', 'scrypt:32768:8:1$KbY5QcTwRohU3ADH$3a16de67b9d9a453082af5fd6b3ec423ccf5314e632045dfb93acd0aab3b1e0c9dca257d95137909aaa1866fbfdc2ee4de7ec60eaa93a83aae546f60163e621e', 'authorized', 97);
INSERT INTO public.credentials VALUES (98, 'user95@example.com', 'scrypt:32768:8:1$Im94pFY1QwNB3SHl$d2b174358c961b7cb58cd68ea1c2dae82e6a4aaee721764d5bb202dd098c1e7ea36dd65b759386b1979c2e3b629de2d00ad7883c6e1f8f2af736e92a6d006657', 'authorized', 98);
INSERT INTO public.credentials VALUES (41, 'user38@example.com', 'scrypt:32768:8:1$CaPj0e0FLGiAoZNU$86f0c01237159f6c0de676c927e05c5ed6e00f1bfced924abc3d68c388831592cc8e54f5480d6ad647640196f80cb6c30999763f9a686bd75bcb71ca64c4b8ef', 'authorized', 41);
INSERT INTO public.credentials VALUES (45, 'user42@example.com', 'scrypt:32768:8:1$2hymMUep93jn0sHk$6f25117115825cfed6bf2f75abf393a35892b48a3c88150a6986d280e77ee7f2ee76bae6a4dd5293138a19e07f3d2a7c690bf95f90cd4709da5863f27ec32bb5', 'authorized', 45);
INSERT INTO public.credentials VALUES (82, 'user79@example.com', 'scrypt:32768:8:1$qdX0Osx2ik5neFmK$83c4af10c1a6f9cbc808309882322313e54d419098f1f69409600c9398e4b7c55b424b99e3c0de59c7304d90f67e42cab42b35c81a81207eca1ce61173040c43', 'authorized', 82);
INSERT INTO public.credentials VALUES (49, 'user46@example.com', 'scrypt:32768:8:1$5VAbAF9OpjUQM8p3$a5012762775a197855895918679af4041e06ba5fdc8ecc5fbd691bd2184cb636098ccd818ae8e919386a6428125d574552caee356a3cf20c22a33b42af2275e9', 'authorized', 49);
INSERT INTO public.credentials VALUES (95, 'user92@example.com', 'scrypt:32768:8:1$pGqxHLDVXXR8gWPB$36b66c4497e32fa0bbf8251765606188924d2838b48d1d34a64b934c678b0b76d00fa2dd897276059602f6e161154e5afe9bb1d40c47930ff0c1ab2cd025f954', 'authorized', 95);
INSERT INTO public.credentials VALUES (90, 'user87@example.com', 'scrypt:32768:8:1$CPdEXVHZNue6iURu$88d173eeac8bc33f6001ade39e50a9154849f6fce65ee48b1bc9f7f27d398a800735a881902494f5b834c4c3b5bce336d6b39167a2234d23d52e567bd9961f6d', 'authorized', 90);
INSERT INTO public.credentials VALUES (91, 'user88@example.com', 'scrypt:32768:8:1$DXcdOteXnEtjtX22$11d093580032b4674018a4b768546f2d325821e3199b204ee28c5609d9379f944419a42b9ef727117f1fea887d12eca39d5948149de537b554d4620b820021ba', 'authorized', 91);
INSERT INTO public.credentials VALUES (94, 'user91@example.com', 'scrypt:32768:8:1$mFuJRxbzAZIjvZE7$dd880979456d6b8223a8ad6dd6f79d7d0694295ffc00c6d34f41c52406d6526f1dd4a56c9ae00e2272ad497fa6ccc9cad6b0bf72bcbb8bda1c83b9c0f2977514', 'authorized', 94);
INSERT INTO public.credentials VALUES (53, 'user50@example.com', 'scrypt:32768:8:1$UBEWLpYHudc684Ud$936bda722190a2a7b55d67a138c52be939880a67e501e9fd8cf5e36622298f8858127c600c609d16d279115906c7512ae2a0fa9378100444c7784ed7326c08c5', 'authorized', 53);
INSERT INTO public.credentials VALUES (96, 'user93@example.com', 'scrypt:32768:8:1$YA17TykP7R1kRd2h$e8afee65ad2ab275ecbc851d1806f854f467682aa394bcd86aca15f6c31d42ebdd473ff023de54664216716747b2d2d222c5b99b34875c02ee6b90a77a6cdc3f', 'authorized', 96);
INSERT INTO public.credentials VALUES (54, 'user51@example.com', 'scrypt:32768:8:1$dMknOIACV0ib2n4I$5ddff26fcb877582e56e70df19046fd8ff77cf36e56eb3150833e9aa10b3cc8ab9226b6dcf75b8c55aa2460d22cc7c3626223b4a5ffd018a1aaf61104b34d694', 'authorized', 54);
INSERT INTO public.credentials VALUES (40, 'user37@example.com', 'scrypt:32768:8:1$qm5s23F4jHiG8bUI$00bbb3da02ede8f62b1c573fba34595306d23a1497a93317f01ebe38bd590bae6075a45228eed79c481ffbf0ff43843f5022b54ef4266967827f5978c193060d', 'authorized', 40);
INSERT INTO public.credentials VALUES (88, 'user85@example.com', 'scrypt:32768:8:1$ZmTCsi67dXv04MeR$53eff61d6cd1082224f30f498df35a72c7e6724a0cdda2df2edf891764922e3e6dc718a2c5769637b894966445d97a5dfabe523a2901bf2f66eb8538480a989c', 'authorized', 88);
INSERT INTO public.credentials VALUES (52, 'user49@example.com', 'scrypt:32768:8:1$3gAqmLYlpjw3ttfl$51c6a8c7d9d783e8eafe63536a7060321ea78725150de6c7ec5aa3ff23dcc0347794a1a1a2d318b191f7d8203493fd82da345de6efa5e1801d742460de894e94', 'authorized', 52);
INSERT INTO public.credentials VALUES (50, 'user47@example.com', 'scrypt:32768:8:1$jXIKPM281FrDjPhp$c2aa10aa44e83e7200625ea43d45736ff5ed894206f607b5f91b0ab3b63aae4930386f6c2add7152c126ae2dbeac70d4da80f2196745620b3793bbd11298e76a', 'authorized', 50);
INSERT INTO public.credentials VALUES (60, 'user57@example.com', 'scrypt:32768:8:1$kDYqJwrL6W3kq3GY$2b2d658af1b5f3ca6c6da3acc91509ffa1a0c64be122c0fcc262a49d2f4d0fdf9952da4643f43690fbc49aa4b8fe21637f4c98bf1eebdfcf798a9f31f8ee0cce', 'authorized', 60);
INSERT INTO public.credentials VALUES (59, 'user56@example.com', 'scrypt:32768:8:1$JFaUFAOmLOTAKGPP$9ed2ad225e1ffc6dd97e513714cfae630cc06b20baca4c87aa7bbe28294a1ed6bf230573f247069e46d61b15e23da61235d0a677f1799173be31864831a91cb3', 'authorized', 59);
INSERT INTO public.credentials VALUES (57, 'user54@example.com', 'scrypt:32768:8:1$bnT0339kFdfd9ZWD$04f0b3f897f1ae6a1da42440df54ad698c395a8e5375106c98313ab174a47d5d89a85e9b7b8b9143ef62dae185e48ac0346a8b4b6dda75f9944d8ae2ddec9f91', 'authorized', 57);
INSERT INTO public.credentials VALUES (58, 'user55@example.com', 'scrypt:32768:8:1$WQdWNwb34YzGheaG$8b5a36a3809596c4fe4df6a018d869e1b3e2f13c4337d42430ceb6519346a369f26af8ed1599b9d582d6a882919add919943cef63e8a7a9df3b13577c558cf33', 'authorized', 58);
INSERT INTO public.credentials VALUES (61, 'user58@example.com', 'scrypt:32768:8:1$u2aDKWDJr50MzCcH$4aa89c4c3fc9def8fd3f4102afaabc76e2cabc04e47b5d5eabaa8860a6c5e382a13a7d18c720f15666643055bad6d09735a26d8d96612f2d6331faaea40ba255', 'authorized', 61);
INSERT INTO public.credentials VALUES (62, 'user59@example.com', 'scrypt:32768:8:1$uJorUoJ9lbu8UJp4$59bc01a7347bc3ee36196c2ddd9458a31ad01eda05c068b381a933781a0a75eea9304eec9a6a38ae3ece88d6e11fad56f9904af7bdeda344230687b18e84a7ff', 'authorized', 62);
INSERT INTO public.credentials VALUES (48, 'user45@example.com', 'scrypt:32768:8:1$UmpwWESPgFUAFS2k$5d4d4beca1d6b5d03cfb79055b41020aa61d4a1bedb3678c5ec55bcaf9887f717017d5c36e369719f907aa61bf370ce7c6d3cca1a22de5e9e8c24514441340f4', 'authorized', 48);
INSERT INTO public.credentials VALUES (63, 'user60@example.com', 'scrypt:32768:8:1$FiJgZjdiqkjFcy7d$5542bfe848bbae430a19cb4dc19dc98cc25fceec7c5565d8916209a82323d01a0faf416a9db13c19cbc39cbf0d5b4642551bb307ba301ebe736e166b969e3274', 'authorized', 63);
INSERT INTO public.credentials VALUES (55, 'user52@example.com', 'scrypt:32768:8:1$48Mm4xrZOavPY1yw$e04838b25ecb791dec7cae44402693b9b47988c6748d9482f97006b26e408fceeb8c6c5ecb8d8153c6326e35a1b3c04020d53c6ebd8096673cb893732f2a850a', 'authorized', 55);
INSERT INTO public.credentials VALUES (76, 'user73@example.com', 'scrypt:32768:8:1$pWTfWeeXslDxOgYI$c2ee9dfa478663b019268ce5ceb073988838ad150f46b34ce1688b60eee458e4774f5cf180f3f554f8c77f1af91e271513897d4ea95607a7c54c07de36b0304e', 'authorized', 76);
INSERT INTO public.credentials VALUES (84, 'user81@example.com', 'scrypt:32768:8:1$25fiH6tV2rJIvZHR$713477aa5d55d16900a4772e3a454c10fed1b8ed24e03cdf35d00369fe1bd6e8cdc8566ddce0680444a390f97c4b95a1431a65fa90f4c7da424533de7f86f087', 'authorized', 84);
INSERT INTO public.credentials VALUES (70, 'user67@example.com', 'scrypt:32768:8:1$QcKxfwfDNJZyxhXW$c340d91b2c0f711e3cb004bdc0b30c6773ac3cb3d0b99a66b7b96a73e614590d43af559003bdaa122ad983bb7da00f8633c3d887ac7f88c05ea304f3115a5963', 'authorized', 70);
INSERT INTO public.credentials VALUES (47, 'user44@example.com', 'scrypt:32768:8:1$TuNBQTEKtETaxzeC$7ba54f81fa9a6a77816a2b53eb235489d680db403cf19b20b7471fe991ef1c43a791606fb9a61233eab53e5035eb3829fe91426548dc95b75191be577480cffa', 'authorized', 47);
INSERT INTO public.credentials VALUES (93, 'user90@example.com', 'scrypt:32768:8:1$VepvFPuYpNlOt64e$4aea61b262a848d5c64a3762dabf27e6da9e385e2e8eeb7a784d4f03949e6b18489c2d1e4d44393b7c31ca75b24df2fddf5cf411353f1797a5ac3105089ec55e', 'authorized', 93);
INSERT INTO public.credentials VALUES (92, 'user89@example.com', 'scrypt:32768:8:1$yGgvOl0PeBJMwcFf$0f73ec5b96ac4744e804c2e66808bde15ed82f617a8789e8ceac2007698bdf0d620917e46e9e43c67be696198569e62da48f32e948bce5b7193f14214094df76', 'authorized', 92);
INSERT INTO public.credentials VALUES (56, 'user53@example.com', 'scrypt:32768:8:1$2uXQ8hHY6m36g4gN$2a720dd9d0f3226b68454bab597c8e940cc89bec7abc3791626070cda14cf1a77e94ebbb2d369510ffa459d1cbd55f27c52b63a272d5b9020d9a6fb1367fc435', 'authorized', 56);
INSERT INTO public.credentials VALUES (102, 'user99@example.com', 'scrypt:32768:8:1$7RxwVPkkKrKMd3yV$d35ff1582cb7157b5631091982dbfe6bcbed6868f8b437e0ad1560c587b1c041178f567392d463e1dc64541f9a1a2922e2c0e75130054fa6b53197eb1636b40d', 'authorized', 102);
INSERT INTO public.credentials VALUES (83, 'user80@example.com', 'scrypt:32768:8:1$ZxubXXb7WvSM30Xd$209bf5627f8e1f65e2256147515b4c44e9fae88104299571328001ecebb845930ff22e8fd193246c68d765345fcbac0b2c287cb0e80026167f6eeca6530ebdee', 'authorized', 83);
INSERT INTO public.credentials VALUES (77, 'user74@example.com', 'scrypt:32768:8:1$se13yGk81ZRGpzjT$db332712783b6451448ec0d3c2d79b1b1c2819f3600985fa8a4664ecc665c093331ef4791592572923a58587be604ff2cf507a0bca246732ffbf003e8fad55ad', 'authorized', 77);
INSERT INTO public.credentials VALUES (75, 'user72@example.com', 'scrypt:32768:8:1$vGp3gOTj3fKrscSl$4df82f56a4140e91a8f4ffdfec6ab1ad22facc4a0465c5fae115d48aff215e988792ddf1ce46078252613665922ceaa43745653a9c31142a0a21018c94aaf8fc', 'authorized', 75);
INSERT INTO public.credentials VALUES (71, 'user68@example.com', 'scrypt:32768:8:1$D3ZY5vS3o6Ua6BkT$20e30a6352bbfdf5a893e9585e911e5a7f6d2ab0a3c7a2d0868e50a21ea0a15dd18dfad97433173acdbabc9c92861babc4244e1f6a09025fa2fba8c4975d71f7', 'authorized', 71);
INSERT INTO public.credentials VALUES (69, 'user66@example.com', 'scrypt:32768:8:1$Wple7OHGigYmF69x$bdbcd4b523da8ebba46f28ec96f87a8b7833d517d1097150e441b61559b4824d91dcae5cb9d864e06448ebe8f413cb9815ab8df18aec9dc57689dc1997e749e1', 'authorized', 69);
INSERT INTO public.credentials VALUES (46, 'user43@example.com', 'scrypt:32768:8:1$WnUjz9iZqa63hSDq$bd99a23123c41b94605ab611fe1e581af3642171fa914dfe93c5b7453fa4670a93d46b4e2720bbf6e5f1a8bfd44cd40f86a90f1ec94ea77dfd9a9fb3a821332d', 'authorized', 46);
INSERT INTO public.credentials VALUES (85, 'user82@example.com', 'scrypt:32768:8:1$ivutPtIaM626EIIJ$683b99fe7dd1de08e9d831f3ef00c075847f2832dfbf03a976ff3b116b65350c9f5cdb0f0c4d938c8080567df43b3075e945bcf22050d91cda9a024e1239145b', 'authorized', 85);
INSERT INTO public.credentials VALUES (86, 'user83@example.com', 'scrypt:32768:8:1$QudQyDqCKJYSzgzr$ba63c63edc053135588ad9514b17fad845154af15d595b52f192a7b0192dd417e43af66937f163cf4cf9f02b61570112d673be12e1476a3638b4c9721071be95', 'authorized', 86);
INSERT INTO public.credentials VALUES (78, 'user75@example.com', 'scrypt:32768:8:1$6oqGkdNX7IsYoKxl$10ac0d02729c6c9816a7bc4ef389a4ea819a1d169e05e2713f07060f36d576dec8e505d1903d62332105323f1fd968d2ef3a0319ff6879bfe549e30c606b35cf', 'authorized', 78);
INSERT INTO public.credentials VALUES (74, 'user71@example.com', 'scrypt:32768:8:1$SIEFy6ea8fW5q7Ds$ca45560603b6af95305b8e74d708946aa9dc0e4799e5bc9e129c26934f47a1a9f2ee2218438b0db303b9d896050ff222d4b2b0783f43981ffb0580269087e1d0', 'authorized', 74);
INSERT INTO public.credentials VALUES (101, 'user98@example.com', 'scrypt:32768:8:1$jUi6cASCHHAXCnkg$35c4125f6f9e4d87e15d592be1ea1b39feb95b903c56385f7154cc5a735a3bfc20ad2dc9f37ffd853e2bfeb6de2258df76240d92abcb8dc5955a5cbe43612bf3', 'authorized', 101);
INSERT INTO public.credentials VALUES (25, 'user22@example.com', 'scrypt:32768:8:1$VaOeKn7Bkv38x0IT$f869150d003044ccce269b602a1aad567e3b04b6d43733db5c8bf054191d11e415ad31de8e20ee77a0b0cc21bd2d3ed41cca57239062d8eb3f51cb26e1af6d2b', 'authorized', 25);
INSERT INTO public.credentials VALUES (29, 'user26@example.com', 'scrypt:32768:8:1$XDOuG4J5Kb5K00YU$72aae84de7f36410b23efa931f2d0095bcd7ae6b9f11ac15dc66e285ed488ec30d444306934e2044c7a5457b4fab5c8ae124c17405724088b213e3822ac14f73', 'authorized', 29);
INSERT INTO public.credentials VALUES (68, 'user65@example.com', 'scrypt:32768:8:1$Sxa64SH7GcpNeFkX$4389db02207155a0beda79d705776111fbd9f39ee53052e24e9110e68d0dced8b50ba82a1a64cce2a92b75bfeb23e9a914c061af2ea8fad4dc1118d93a34c093', 'authorized', 68);


--
-- Data for Name: dislike; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.dislike VALUES (398, 2, 102, '2025-07-20 21:36:17.074759+03');
INSERT INTO public.dislike VALUES (401, 2, 92, '2025-07-30 12:01:08.129835+03');
INSERT INTO public.dislike VALUES (402, 2, 91, '2025-07-30 12:01:08.853807+03');
INSERT INTO public.dislike VALUES (403, 2, 88, '2025-07-30 12:01:10.981822+03');
INSERT INTO public.dislike VALUES (404, 2, 87, '2025-07-30 12:01:11.451125+03');
INSERT INTO public.dislike VALUES (405, 2, 85, '2025-07-30 12:01:12.514572+03');
INSERT INTO public.dislike VALUES (406, 2, 82, '2025-08-12 16:40:33.512902+03');
INSERT INTO public.dislike VALUES (407, 2, 81, '2025-08-12 16:40:41.302094+03');
INSERT INTO public.dislike VALUES (408, 2, 80, '2025-08-12 16:40:42.087687+03');
INSERT INTO public.dislike VALUES (409, 2, 78, '2025-08-12 16:40:45.296461+03');
INSERT INTO public.dislike VALUES (410, 2, 77, '2025-08-12 16:40:46.558264+03');
INSERT INTO public.dislike VALUES (411, 2, 76, '2025-08-12 16:40:48.218179+03');
INSERT INTO public.dislike VALUES (412, 2, 75, '2025-08-12 16:40:51.707148+03');
INSERT INTO public.dislike VALUES (413, 2, 74, '2025-08-12 16:42:31.83278+03');
INSERT INTO public.dislike VALUES (414, 2, 68, '2025-08-12 16:43:42.954605+03');
INSERT INTO public.dislike VALUES (415, 2, 67, '2025-08-12 16:43:43.774675+03');
INSERT INTO public.dislike VALUES (428, 2, 61, '2025-08-13 15:25:30.901035+03');
INSERT INTO public.dislike VALUES (429, 2, 60, '2025-08-13 15:25:31.652845+03');
INSERT INTO public.dislike VALUES (430, 2, 58, '2025-08-13 15:27:44.761051+03');
INSERT INTO public.dislike VALUES (498, 2, 55, '2025-08-20 12:00:19.8198+03');
INSERT INTO public.dislike VALUES (499, 2, 52, '2025-08-20 12:00:22.175857+03');
INSERT INTO public.dislike VALUES (506, 107, 102, '2025-08-26 13:40:40.209951+03');
INSERT INTO public.dislike VALUES (525, 2, 49, '2025-09-29 09:02:19.761964+03');
INSERT INTO public.dislike VALUES (526, 2, 46, '2025-09-29 09:02:21.683071+03');
INSERT INTO public.dislike VALUES (527, 2, 45, '2025-09-29 09:02:22.134883+03');
INSERT INTO public.dislike VALUES (528, 2, 44, '2025-09-29 09:02:23.620188+03');
INSERT INTO public.dislike VALUES (529, 2, 115, '2025-11-12 17:52:10.267613+02');
INSERT INTO public.dislike VALUES (531, 2, 41, '2025-11-12 17:52:15.753088+02');
INSERT INTO public.dislike VALUES (532, 2, 37, '2025-11-12 17:54:58.841267+02');
INSERT INTO public.dislike VALUES (533, 2, 33, '2025-11-12 17:55:03.741649+02');
INSERT INTO public.dislike VALUES (559, 103, 115, '2025-11-22 22:15:04.590226+02');


--
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gender VALUES (1, 'male');
INSERT INTO public.gender VALUES (2, 'female');
INSERT INTO public.gender VALUES (3, 'other');
INSERT INTO public.gender VALUES (4, 'any');


--
-- Data for Name: interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.interest VALUES (1, 'Подорожі');
INSERT INTO public.interest VALUES (2, 'Музика');
INSERT INTO public.interest VALUES (3, 'Спорт');
INSERT INTO public.interest VALUES (4, 'Кулінарія');
INSERT INTO public.interest VALUES (5, 'Мистецтво');
INSERT INTO public.interest VALUES (6, 'Фотографія');
INSERT INTO public.interest VALUES (7, 'Йога');
INSERT INTO public.interest VALUES (8, 'Танці');
INSERT INTO public.interest VALUES (9, 'Читання');
INSERT INTO public.interest VALUES (10, 'Кіно');
INSERT INTO public.interest VALUES (11, 'Астрологія');
INSERT INTO public.interest VALUES (12, 'Медитація');


--
-- Data for Name: like; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."like" VALUES (221, 103, 110, '2025-08-26 14:30:45.121331+03');
INSERT INTO public."like" VALUES (222, 103, 102, '2025-08-26 14:30:48.613385+03');
INSERT INTO public."like" VALUES (223, 103, 102, '2025-08-26 14:30:48.62892+03');
INSERT INTO public."like" VALUES (224, 103, 86, '2025-08-26 14:30:50.70738+03');
INSERT INTO public."like" VALUES (225, 103, 86, '2025-08-26 14:30:50.719121+03');
INSERT INTO public."like" VALUES (127, 2, 101, '2025-07-24 11:13:02.19969+03');
INSERT INTO public."like" VALUES (128, 2, 100, '2025-07-24 11:13:03.138372+03');
INSERT INTO public."like" VALUES (129, 2, 99, '2025-07-24 11:51:20.412691+03');
INSERT INTO public."like" VALUES (130, 2, 98, '2025-07-24 11:51:21.768087+03');
INSERT INTO public."like" VALUES (131, 2, 97, '2025-07-24 11:51:22.543897+03');
INSERT INTO public."like" VALUES (132, 2, 96, '2025-07-24 11:51:23.301826+03');
INSERT INTO public."like" VALUES (133, 2, 95, '2025-07-24 11:51:24.620157+03');
INSERT INTO public."like" VALUES (134, 2, 94, '2025-07-24 11:51:25.356946+03');
INSERT INTO public."like" VALUES (135, 2, 93, '2025-07-24 11:51:26.335812+03');
INSERT INTO public."like" VALUES (136, 2, 90, '2025-07-30 12:01:09.891912+03');
INSERT INTO public."like" VALUES (137, 2, 89, '2025-07-30 12:01:10.50568+03');
INSERT INTO public."like" VALUES (138, 2, 86, '2025-07-30 12:01:11.945667+03');
INSERT INTO public."like" VALUES (139, 2, 84, '2025-07-30 12:01:13.083156+03');
INSERT INTO public."like" VALUES (140, 2, 83, '2025-08-12 16:40:32.771236+03');
INSERT INTO public."like" VALUES (141, 2, 79, '2025-08-12 16:40:43.111955+03');
INSERT INTO public."like" VALUES (142, 2, 73, '2025-08-12 16:43:35.522163+03');
INSERT INTO public."like" VALUES (143, 2, 72, '2025-08-12 16:43:36.621213+03');
INSERT INTO public."like" VALUES (144, 2, 71, '2025-08-12 16:43:40.637399+03');
INSERT INTO public."like" VALUES (145, 2, 70, '2025-08-12 16:43:41.239798+03');
INSERT INTO public."like" VALUES (146, 2, 69, '2025-08-12 16:43:42.179804+03');
INSERT INTO public."like" VALUES (227, 103, 101, '2025-08-26 15:36:50.957054+03');
INSERT INTO public."like" VALUES (228, 103, 76, '2025-08-26 15:36:51.979907+03');
INSERT INTO public."like" VALUES (229, 103, 73, '2025-08-26 15:36:52.796646+03');
INSERT INTO public."like" VALUES (230, 103, 70, '2025-08-26 15:36:53.565787+03');
INSERT INTO public."like" VALUES (231, 103, 62, '2025-08-26 15:36:54.344178+03');
INSERT INTO public."like" VALUES (232, 103, 61, '2025-08-26 15:36:55.342851+03');
INSERT INTO public."like" VALUES (233, 103, 55, '2025-09-08 10:33:49.263783+03');
INSERT INTO public."like" VALUES (234, 103, 54, '2025-09-08 10:33:49.894072+03');
INSERT INTO public."like" VALUES (235, 103, 44, '2025-09-08 10:35:41.088902+03');
INSERT INTO public."like" VALUES (236, 103, 31, '2025-09-08 10:35:42.685096+03');
INSERT INTO public."like" VALUES (237, 103, 21, '2025-09-08 10:35:44.971559+03');
INSERT INTO public."like" VALUES (238, 103, 15, '2025-09-08 10:35:47.99951+03');
INSERT INTO public."like" VALUES (239, 103, 10, '2025-09-08 10:36:01.328766+03');
INSERT INTO public."like" VALUES (240, 103, 9, '2025-09-08 10:36:02.815607+03');
INSERT INTO public."like" VALUES (161, 2, 65, '2025-08-13 15:25:19.057677+03');
INSERT INTO public."like" VALUES (162, 2, 64, '2025-08-13 15:25:23.274921+03');
INSERT INTO public."like" VALUES (163, 2, 63, '2025-08-13 15:25:25.782494+03');
INSERT INTO public."like" VALUES (164, 2, 62, '2025-08-13 15:25:28.296404+03');
INSERT INTO public."like" VALUES (165, 2, 59, '2025-08-13 15:27:43.957893+03');
INSERT INTO public."like" VALUES (166, 2, 57, '2025-08-13 15:27:45.529006+03');
INSERT INTO public."like" VALUES (167, 2, 56, '2025-08-13 15:27:55.658262+03');
INSERT INTO public."like" VALUES (241, 103, 7, '2025-09-08 10:36:03.700213+03');
INSERT INTO public."like" VALUES (242, 103, 45, '2025-09-08 10:36:39.508811+03');
INSERT INTO public."like" VALUES (243, 103, 28, '2025-09-08 10:36:41.097087+03');
INSERT INTO public."like" VALUES (244, 2, 48, '2025-09-29 09:02:20.482069+03');
INSERT INTO public."like" VALUES (245, 2, 47, '2025-09-29 09:02:21.210919+03');
INSERT INTO public."like" VALUES (246, 2, 40, '2025-11-12 17:52:17.047361+02');
INSERT INTO public."like" VALUES (250, 103, 60, '2025-11-22 22:14:49.976619+02');
INSERT INTO public."like" VALUES (251, 103, 35, '2025-11-22 22:14:51.391646+02');
INSERT INTO public."like" VALUES (195, 103, 2, '2025-08-15 18:30:04.194273+03');
INSERT INTO public."like" VALUES (196, 2, 103, '2025-08-15 18:30:21.330472+03');
INSERT INTO public."like" VALUES (198, 2, 54, '2025-08-20 12:00:20.504205+03');
INSERT INTO public."like" VALUES (199, 2, 53, '2025-08-20 12:00:21.592659+03');
INSERT INTO public."like" VALUES (200, 2, 51, '2025-08-20 12:00:22.757567+03');
INSERT INTO public."like" VALUES (201, 2, 50, '2025-08-20 12:00:26.853384+03');


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.matches VALUES (14, 103, 2, '2025-08-15', false, 'хех');


--
-- Data for Name: meeting_feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.meeting_feedbacks VALUES (4, 7, 103, 's', true, true, false, '2025-08-15 17:54:27.466545+03');
INSERT INTO public.meeting_feedbacks VALUES (3, 8, 103, 'Зустріч не відбулась', false, false, true, '2025-08-14 16:44:51.019508+03');
INSERT INTO public.meeting_feedbacks VALUES (5, 10, 2, 'тарєлочніца.', false, false, false, '2025-11-16 23:56:19.361836+02');


--
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.meetings VALUES (3, 2, 103, '2025-07-28 11:11:00+03', '50.46380953499547 30.50989151000977', NULL, NULL, NULL, true, '2025-07-27 00:00:00+03');
INSERT INTO public.meetings VALUES (8, 103, 2, '2025-12-12 12:12:00+02', '50.43615247119602 30.52401845891349', NULL, 'прів', NULL, true, '2025-08-14 00:00:00+03');
INSERT INTO public.meetings VALUES (9, 2, 103, '2222-11-11 22:22:00+02', '50.463044612856365 30.51851070983296', NULL, 'БІМБААА', 'хех)', false, '2025-08-15 00:00:00+03');
INSERT INTO public.meetings VALUES (7, 103, 2, '2025-08-29 06:00:00+03', '50.464137354982 30.529483895616025', '', 'хех)', '', true, '2025-08-12 00:00:00+03');
INSERT INTO public.meetings VALUES (6, 2, 103, '2025-07-30 15:22:00+03', '51.21151846300155 24.697279956613503', '', '1', '', true, '2025-07-30 00:00:00+03');
INSERT INTO public.meetings VALUES (1, 2, 103, '2025-07-25 08:11:00+03', '50.44977704981385 30.52485823631287', '', '1', '2', true, '2025-07-24 00:00:00+03');
INSERT INTO public.meetings VALUES (11, 2, 103, '2025-08-21 12:00:00+03', '44.947255271085204 34.120171382809254', NULL, 'ПривітикиИ!!!', NULL, true, '2025-08-20 00:00:00+03');
INSERT INTO public.meetings VALUES (12, 103, 2, '2025-08-27 12:00:00+03', '50.448523770265645 30.489792651795188', NULL, NULL, NULL, true, '2025-08-25 00:00:00+03');
INSERT INTO public.meetings VALUES (10, 103, 2, '2025-09-10 23:22:00+03', '51.21235085378507 24.69757149047763', NULL, 'fghphhgjghj', NULL, true, '2025-08-19 00:00:00+03');
INSERT INTO public.meetings VALUES (13, 2, 103, '2025-11-21 22:22:00+02', '48.41791890760352 22.22212089271274', NULL, NULL, NULL, false, '2025-11-16 00:00:00+02');


--
-- Data for Name: partner_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.partner_preferences VALUES (10, 3, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (11, 4, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (12, 5, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (13, 6, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (14, 7, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (16, 9, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (17, 10, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (18, 11, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (19, 12, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (21, 14, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (22, 15, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (23, 16, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (24, 17, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (25, 18, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (27, 20, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (28, 21, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (29, 22, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (31, 24, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (32, 25, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (33, 26, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (34, 27, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (35, 28, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (36, 29, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (38, 31, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (39, 32, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (40, 33, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (41, 34, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (42, 35, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (43, 36, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (44, 37, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (45, 38, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (46, 39, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (47, 40, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (48, 41, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (51, 44, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (52, 45, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (53, 46, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (54, 47, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (55, 48, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (56, 49, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (57, 50, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (58, 51, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (59, 52, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (60, 53, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (61, 54, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (62, 55, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (63, 56, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (64, 57, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (65, 58, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (66, 59, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (67, 60, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (68, 61, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (69, 62, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (70, 63, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (71, 64, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (72, 65, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (74, 67, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (75, 68, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (76, 69, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (77, 70, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (78, 71, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (79, 72, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (80, 73, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (81, 74, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (82, 75, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (83, 76, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (84, 77, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (85, 78, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (86, 79, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (87, 80, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (88, 81, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (89, 82, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (90, 83, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (91, 84, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (92, 85, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (93, 86, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (94, 87, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (95, 88, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (96, 89, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (97, 90, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (98, 91, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (99, 92, 18, 35, 150, 200, 50, 100, 3);
INSERT INTO public.partner_preferences VALUES (100, 93, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (101, 94, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (102, 95, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (103, 96, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (104, 97, 18, 35, 150, 200, 50, 100, 4);
INSERT INTO public.partner_preferences VALUES (105, 98, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (106, 99, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (107, 100, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (108, 101, 18, 35, 150, 200, 50, 100, 1);
INSERT INTO public.partner_preferences VALUES (109, 102, 18, 35, 150, 200, 50, 100, 2);
INSERT INTO public.partner_preferences VALUES (125, 2, 18, 100, 100, 250, 30, 200, 4);
INSERT INTO public.partner_preferences VALUES (127, 103, NULL, NULL, NULL, NULL, NULL, NULL, 1);


--
-- Data for Name: preference_interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.preference_interest VALUES (13, 125, 5);
INSERT INTO public.preference_interest VALUES (15, 127, 4);
INSERT INTO public.preference_interest VALUES (16, 127, 5);
INSERT INTO public.preference_interest VALUES (17, 127, 9);
INSERT INTO public.preference_interest VALUES (18, 127, 2);


--
-- Data for Name: preference_signs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.preference_signs VALUES (22, 10, 1);
INSERT INTO public.preference_signs VALUES (23, 11, 7);
INSERT INTO public.preference_signs VALUES (24, 11, 3);
INSERT INTO public.preference_signs VALUES (25, 12, 6);
INSERT INTO public.preference_signs VALUES (26, 12, 2);
INSERT INTO public.preference_signs VALUES (27, 13, 10);
INSERT INTO public.preference_signs VALUES (28, 13, 11);
INSERT INTO public.preference_signs VALUES (29, 13, 5);
INSERT INTO public.preference_signs VALUES (30, 14, 8);
INSERT INTO public.preference_signs VALUES (31, 14, 7);
INSERT INTO public.preference_signs VALUES (35, 16, 11);
INSERT INTO public.preference_signs VALUES (36, 16, 4);
INSERT INTO public.preference_signs VALUES (37, 17, 4);
INSERT INTO public.preference_signs VALUES (38, 17, 9);
INSERT INTO public.preference_signs VALUES (39, 18, 12);
INSERT INTO public.preference_signs VALUES (40, 18, 4);
INSERT INTO public.preference_signs VALUES (41, 19, 8);
INSERT INTO public.preference_signs VALUES (43, 21, 6);
INSERT INTO public.preference_signs VALUES (44, 22, 1);
INSERT INTO public.preference_signs VALUES (45, 22, 3);
INSERT INTO public.preference_signs VALUES (46, 22, 2);
INSERT INTO public.preference_signs VALUES (47, 23, 10);
INSERT INTO public.preference_signs VALUES (48, 24, 10);
INSERT INTO public.preference_signs VALUES (49, 25, 7);
INSERT INTO public.preference_signs VALUES (50, 25, 4);
INSERT INTO public.preference_signs VALUES (51, 25, 5);
INSERT INTO public.preference_signs VALUES (53, 27, 10);
INSERT INTO public.preference_signs VALUES (54, 28, 8);
INSERT INTO public.preference_signs VALUES (55, 28, 9);
INSERT INTO public.preference_signs VALUES (56, 28, 5);
INSERT INTO public.preference_signs VALUES (57, 29, 6);
INSERT INTO public.preference_signs VALUES (59, 31, 3);
INSERT INTO public.preference_signs VALUES (60, 31, 7);
INSERT INTO public.preference_signs VALUES (61, 31, 4);
INSERT INTO public.preference_signs VALUES (62, 32, 8);
INSERT INTO public.preference_signs VALUES (63, 33, 4);
INSERT INTO public.preference_signs VALUES (64, 34, 2);
INSERT INTO public.preference_signs VALUES (65, 34, 1);
INSERT INTO public.preference_signs VALUES (66, 34, 12);
INSERT INTO public.preference_signs VALUES (67, 35, 9);
INSERT INTO public.preference_signs VALUES (68, 35, 12);
INSERT INTO public.preference_signs VALUES (69, 36, 11);
INSERT INTO public.preference_signs VALUES (70, 36, 6);
INSERT INTO public.preference_signs VALUES (71, 36, 12);
INSERT INTO public.preference_signs VALUES (75, 38, 7);
INSERT INTO public.preference_signs VALUES (76, 38, 2);
INSERT INTO public.preference_signs VALUES (77, 39, 8);
INSERT INTO public.preference_signs VALUES (78, 39, 1);
INSERT INTO public.preference_signs VALUES (79, 39, 12);
INSERT INTO public.preference_signs VALUES (80, 40, 11);
INSERT INTO public.preference_signs VALUES (81, 40, 9);
INSERT INTO public.preference_signs VALUES (82, 41, 8);
INSERT INTO public.preference_signs VALUES (83, 41, 5);
INSERT INTO public.preference_signs VALUES (84, 41, 1);
INSERT INTO public.preference_signs VALUES (85, 42, 6);
INSERT INTO public.preference_signs VALUES (86, 42, 3);
INSERT INTO public.preference_signs VALUES (87, 42, 5);
INSERT INTO public.preference_signs VALUES (88, 43, 2);
INSERT INTO public.preference_signs VALUES (89, 43, 12);
INSERT INTO public.preference_signs VALUES (90, 44, 1);
INSERT INTO public.preference_signs VALUES (91, 44, 6);
INSERT INTO public.preference_signs VALUES (92, 45, 8);
INSERT INTO public.preference_signs VALUES (93, 45, 6);
INSERT INTO public.preference_signs VALUES (94, 46, 2);
INSERT INTO public.preference_signs VALUES (95, 46, 3);
INSERT INTO public.preference_signs VALUES (96, 47, 6);
INSERT INTO public.preference_signs VALUES (97, 48, 9);
INSERT INTO public.preference_signs VALUES (98, 48, 7);
INSERT INTO public.preference_signs VALUES (103, 51, 8);
INSERT INTO public.preference_signs VALUES (104, 52, 8);
INSERT INTO public.preference_signs VALUES (105, 52, 6);
INSERT INTO public.preference_signs VALUES (106, 52, 10);
INSERT INTO public.preference_signs VALUES (107, 53, 4);
INSERT INTO public.preference_signs VALUES (108, 53, 6);
INSERT INTO public.preference_signs VALUES (109, 53, 10);
INSERT INTO public.preference_signs VALUES (110, 54, 9);
INSERT INTO public.preference_signs VALUES (111, 55, 2);
INSERT INTO public.preference_signs VALUES (112, 55, 12);
INSERT INTO public.preference_signs VALUES (113, 56, 3);
INSERT INTO public.preference_signs VALUES (114, 56, 9);
INSERT INTO public.preference_signs VALUES (115, 56, 7);
INSERT INTO public.preference_signs VALUES (116, 57, 3);
INSERT INTO public.preference_signs VALUES (117, 57, 6);
INSERT INTO public.preference_signs VALUES (118, 58, 4);
INSERT INTO public.preference_signs VALUES (119, 58, 11);
INSERT INTO public.preference_signs VALUES (120, 59, 11);
INSERT INTO public.preference_signs VALUES (121, 59, 7);
INSERT INTO public.preference_signs VALUES (122, 60, 10);
INSERT INTO public.preference_signs VALUES (123, 60, 7);
INSERT INTO public.preference_signs VALUES (124, 60, 9);
INSERT INTO public.preference_signs VALUES (125, 61, 10);
INSERT INTO public.preference_signs VALUES (126, 62, 5);
INSERT INTO public.preference_signs VALUES (127, 62, 7);
INSERT INTO public.preference_signs VALUES (128, 63, 5);
INSERT INTO public.preference_signs VALUES (129, 63, 4);
INSERT INTO public.preference_signs VALUES (130, 64, 8);
INSERT INTO public.preference_signs VALUES (131, 64, 7);
INSERT INTO public.preference_signs VALUES (132, 65, 12);
INSERT INTO public.preference_signs VALUES (133, 65, 6);
INSERT INTO public.preference_signs VALUES (134, 66, 11);
INSERT INTO public.preference_signs VALUES (135, 67, 1);
INSERT INTO public.preference_signs VALUES (136, 67, 6);
INSERT INTO public.preference_signs VALUES (137, 68, 2);
INSERT INTO public.preference_signs VALUES (138, 69, 12);
INSERT INTO public.preference_signs VALUES (139, 69, 8);
INSERT INTO public.preference_signs VALUES (140, 69, 1);
INSERT INTO public.preference_signs VALUES (141, 70, 12);
INSERT INTO public.preference_signs VALUES (142, 70, 6);
INSERT INTO public.preference_signs VALUES (143, 71, 12);
INSERT INTO public.preference_signs VALUES (144, 71, 1);
INSERT INTO public.preference_signs VALUES (145, 71, 11);
INSERT INTO public.preference_signs VALUES (146, 72, 7);
INSERT INTO public.preference_signs VALUES (147, 72, 11);
INSERT INTO public.preference_signs VALUES (151, 74, 8);
INSERT INTO public.preference_signs VALUES (152, 75, 7);
INSERT INTO public.preference_signs VALUES (153, 75, 4);
INSERT INTO public.preference_signs VALUES (154, 76, 6);
INSERT INTO public.preference_signs VALUES (155, 76, 9);
INSERT INTO public.preference_signs VALUES (156, 77, 10);
INSERT INTO public.preference_signs VALUES (157, 78, 12);
INSERT INTO public.preference_signs VALUES (158, 78, 2);
INSERT INTO public.preference_signs VALUES (159, 78, 7);
INSERT INTO public.preference_signs VALUES (160, 79, 10);
INSERT INTO public.preference_signs VALUES (161, 80, 7);
INSERT INTO public.preference_signs VALUES (162, 80, 4);
INSERT INTO public.preference_signs VALUES (163, 80, 6);
INSERT INTO public.preference_signs VALUES (164, 81, 4);
INSERT INTO public.preference_signs VALUES (165, 81, 3);
INSERT INTO public.preference_signs VALUES (166, 82, 2);
INSERT INTO public.preference_signs VALUES (167, 82, 7);
INSERT INTO public.preference_signs VALUES (168, 82, 3);
INSERT INTO public.preference_signs VALUES (169, 83, 8);
INSERT INTO public.preference_signs VALUES (170, 83, 9);
INSERT INTO public.preference_signs VALUES (171, 83, 4);
INSERT INTO public.preference_signs VALUES (172, 84, 9);
INSERT INTO public.preference_signs VALUES (173, 84, 7);
INSERT INTO public.preference_signs VALUES (174, 85, 5);
INSERT INTO public.preference_signs VALUES (175, 85, 12);
INSERT INTO public.preference_signs VALUES (176, 86, 5);
INSERT INTO public.preference_signs VALUES (177, 86, 3);
INSERT INTO public.preference_signs VALUES (178, 86, 2);
INSERT INTO public.preference_signs VALUES (179, 87, 6);
INSERT INTO public.preference_signs VALUES (180, 88, 12);
INSERT INTO public.preference_signs VALUES (181, 89, 8);
INSERT INTO public.preference_signs VALUES (182, 90, 10);
INSERT INTO public.preference_signs VALUES (183, 90, 3);
INSERT INTO public.preference_signs VALUES (184, 91, 5);
INSERT INTO public.preference_signs VALUES (185, 91, 7);
INSERT INTO public.preference_signs VALUES (186, 91, 9);
INSERT INTO public.preference_signs VALUES (187, 92, 9);
INSERT INTO public.preference_signs VALUES (188, 92, 3);
INSERT INTO public.preference_signs VALUES (189, 92, 4);
INSERT INTO public.preference_signs VALUES (190, 93, 5);
INSERT INTO public.preference_signs VALUES (191, 93, 10);
INSERT INTO public.preference_signs VALUES (192, 93, 3);
INSERT INTO public.preference_signs VALUES (193, 94, 2);
INSERT INTO public.preference_signs VALUES (194, 95, 9);
INSERT INTO public.preference_signs VALUES (195, 96, 6);
INSERT INTO public.preference_signs VALUES (196, 97, 9);
INSERT INTO public.preference_signs VALUES (197, 97, 4);
INSERT INTO public.preference_signs VALUES (198, 98, 4);
INSERT INTO public.preference_signs VALUES (199, 99, 4);
INSERT INTO public.preference_signs VALUES (200, 100, 5);
INSERT INTO public.preference_signs VALUES (201, 101, 12);
INSERT INTO public.preference_signs VALUES (202, 101, 7);
INSERT INTO public.preference_signs VALUES (203, 101, 10);
INSERT INTO public.preference_signs VALUES (204, 102, 3);
INSERT INTO public.preference_signs VALUES (205, 102, 7);
INSERT INTO public.preference_signs VALUES (206, 102, 11);
INSERT INTO public.preference_signs VALUES (207, 103, 7);
INSERT INTO public.preference_signs VALUES (208, 104, 5);
INSERT INTO public.preference_signs VALUES (209, 104, 10);
INSERT INTO public.preference_signs VALUES (210, 105, 7);
INSERT INTO public.preference_signs VALUES (211, 105, 12);
INSERT INTO public.preference_signs VALUES (212, 106, 3);
INSERT INTO public.preference_signs VALUES (213, 106, 1);
INSERT INTO public.preference_signs VALUES (214, 106, 4);
INSERT INTO public.preference_signs VALUES (215, 107, 11);
INSERT INTO public.preference_signs VALUES (216, 108, 11);
INSERT INTO public.preference_signs VALUES (217, 108, 3);
INSERT INTO public.preference_signs VALUES (218, 108, 4);
INSERT INTO public.preference_signs VALUES (219, 109, 3);


--
-- Data for Name: refusals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.refusals VALUES (2, 104, '2025-08-12', 'no-matches', '', 'хех)');
INSERT INTO public.refusals VALUES (4, 106, '2025-08-12', 'privacy-concerns', '', '');
INSERT INTO public.refusals VALUES (5, 107, '2025-08-26', 'too-busy', '', '');


--
-- Data for Name: restore_code; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_images; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_interest VALUES (287, 106, 3);
INSERT INTO public.user_interest VALUES (328, 2, 11);
INSERT INTO public.user_interest VALUES (329, 2, 10);
INSERT INTO public.user_interest VALUES (330, 2, 5);
INSERT INTO public.user_interest VALUES (331, 2, 4);
INSERT INTO public.user_interest VALUES (332, 2, 9);
INSERT INTO public.user_interest VALUES (333, 103, 5);
INSERT INTO public.user_interest VALUES (334, 103, 4);
INSERT INTO public.user_interest VALUES (335, 103, 11);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (107, 1, '2025-08-18', 'ґеґнутий', 'бульбік', '2000-08-06', NULL, NULL, 'heh)', false, 7, false);
INSERT INTO public.users VALUES (2, 1, '2025-07-08', 'Анна', 'Іванівна', '2000-01-01', 120, 30, 'Мій новий біо, оновлений тестом 1763299610', true, 12, true);
INSERT INTO public.users VALUES (26, 2, '2025-08-13', 'Єва', 'Конопля', '1998-02-08', 163, 84, 'Терапія інструкція головка перебивати. Падаль палиця знищення.', true, 7, false);
INSERT INTO public.users VALUES (31, 1, '2025-08-13', 'Леон', 'Андрійчук', '2005-03-03', 171, 72, 'Помовчати командування полум''я міф розлад. П''Ятеро ремінь рис серйозний рішення. Покинути ґудзик діловий диявол термін.', true, 6, false);
INSERT INTO public.users VALUES (115, 1, '2025-11-09', 'Гріша', 'Баклажанчік', '2000-07-12', 166, 66, '123', true, 9, false);
INSERT INTO public.users VALUES (68, 2, '2025-08-16', 'Камілла', 'Конопленко', '2003-08-23', 163, 99, 'Нестерпний виражений соціалістичний. Перетнути направо програміст мить хліб.', true, 11, false);
INSERT INTO public.users VALUES (48, 2, '2025-08-16', 'Клавдія', 'Демʼянюк', '2003-08-11', 188, 58, 'Вивести що актриса нині. Поїзд міф доба хлопчисько встати простір плід.
Зелений результат яблуко виражений. Більше космос розкішний лапа уточнити сміливий.', true, 10, false);
INSERT INTO public.users VALUES (65, 3, '2025-08-13', 'Юстина', 'Макогон', '1993-08-24', 172, 81, 'Занадто факультет гіркий хотіти пристрасть легко. Нині шолом фахівець склянка адвокат зображати ставити райком.', true, 3, false);
INSERT INTO public.users VALUES (53, 3, '2025-08-16', 'Аліна', 'Комар', '1990-11-25', 159, 67, 'Мимо кут прірва направо. В''Язниця радість знімати очко. Їсти уникати нині мотоцикл.
Зрідка гіркий монета роса рішення прелесть. Бак підлога ручка кидати. Від''Їзд приходити провал упустити.', true, 7, false);
INSERT INTO public.users VALUES (51, 2, '2025-08-16', 'Альбіна', 'Щорс', '1993-07-23', 193, 83, 'Звільнення важливий число підземний камінчик потягнутися господь інтелектуальний. Мільярд помовчати збудження відповідність демократія вибирати комунізм.', true, 6, false);
INSERT INTO public.users VALUES (109, 3, '2025-08-26', 'сергій', 'нейченко', '2006-04-01', NULL, NULL, NULL, true, 3, false);
INSERT INTO public.users VALUES (103, 3, '2025-07-20', 'Коханчик', 'Коханий', '1995-01-15', 123, 123, 'Люблю нагетси і папуг.', true, 12, true);
INSERT INTO public.users VALUES (110, 1, '2025-08-26', 'Кирило', 'Береговий', '2005-07-20', NULL, NULL, NULL, true, 6, false);
INSERT INTO public.users VALUES (83, 3, '2025-07-11', 'Розалія', 'Сіробаба', '1986-07-21', 164, 57, 'Синок брову вітати квапливий. Друкувати висіти покидати тисяча метал. Мить бочок полум''я розвернутися вітрина хліб.
Космос прихований спорт блін. Терапія солома перебивати провал шкарпетка.', true, 11, false);
INSERT INTO public.users VALUES (71, 2, '2025-07-11', 'Віолетта', 'Бабʼюк', '1995-08-11', 191, 84, 'Нарада тисяча армійський палата шкільний провінція досліджено.', true, 2, false);
INSERT INTO public.users VALUES (77, 3, '2025-07-11', 'Ірена', 'Малик', '2005-05-27', 187, 67, 'Прелесть армійський передо міф розуміти натиснути. Брову їжа інфекція світило єврейський природний метал. Штаб дорогий солома прощення гараж.', true, 9, false);
INSERT INTO public.users VALUES (70, 1, '2025-07-11', 'Валентин', 'Гавриш', '2002-12-20', 187, 90, 'Яскраво подробиця природний палиця здригнутися господь. Тута єдиний сходити природа потрясти. Їжа пробувати вітрина.', true, 4, false);
INSERT INTO public.users VALUES (79, 3, '2025-07-11', 'Марта', 'Влох', '1990-07-09', 167, 74, 'Природний плавно легко. Потрясти розуміти поріг провінція метал адже важливий колектив.', true, 3, false);
INSERT INTO public.users VALUES (57, 3, '2025-07-11', 'Ольга', 'Хомик', '2006-05-03', 161, 92, 'Услати мільярд червень мить сміливий секунда ніж. Соціалістичний заява грати ліловий труп.', true, 12, false);
INSERT INTO public.users VALUES (9, 1, '2025-07-11', 'Світлана', 'Петлюра', '2003-08-18', 180, 68, 'Мотоцикл степ інтернет фахівець. Заплакати ліворуч порівняння вчора означати деякий. Наполегливо образа збільшуватися тута робочий процес груди заспокоїтися.', true, 1, false);
INSERT INTO public.users VALUES (97, 2, '2025-07-11', 'Віра', 'Ребрик', '1991-04-22', 176, 70, 'Обуритися підземний єврейський загроза рот сміятися. Командувач реклама яблуко підкинути чотири покинути інший.
Рис хотіти вперед вибирати. Правий покидати поставити блискучий житель.', true, 4, false);
INSERT INTO public.users VALUES (100, 3, '2025-07-11', 'Софія', 'Цюпа', '1992-10-05', 174, 98, 'Оборот встати слати трясти. Рота уточнити взагалі. Дальній порада хата міф.', true, 3, false);
INSERT INTO public.users VALUES (72, 2, '2025-07-11', 'Амалія', 'Засенко', '1997-10-31', 185, 90, 'Пристрій інвалід триста більше наштовхнутися. Ніч райком терапія командувач раніше.', true, 2, false);
INSERT INTO public.users VALUES (67, 2, '2025-07-11', 'Емілія', 'Карась', '2006-06-12', 196, 97, 'Плавно брову банк прощення труп черговий. Витримати вітрина палиця червень можливо витримати пастух оборот. Хід уточнити степ.', true, 9, false);
INSERT INTO public.users VALUES (93, 2, '2025-07-11', 'Альбіна', 'Назаренко', '1987-01-01', 194, 77, 'Космос кидати поява мотоцикл функція. Загроза провінція червʼяк командир щось.
Шкарпетка сумний житель. Дорогий від''їзд мета салон. Перебивати струмок метал шкільний природа падати.', true, 1, false);
INSERT INTO public.users VALUES (37, 2, '2025-07-11', 'Аніта', 'Щербань', '1984-07-19', 170, 58, 'Шкарпетка отже співрозмовник товар палата. Сміливий спорт палець художній благати командувач.
Несподіваний різноманітний присвятити ідея академік похмуро. Важливий ефект район образа лапа.', true, 7, false);
INSERT INTO public.users VALUES (94, 2, '2025-07-11', 'Емілія', 'Ніколюк', '1993-07-13', 178, 59, 'Можливо банк присвятити факультет. Бок занадто болото хлопчисько ідея.
Термін друкувати зміна ставити. Спорт лівий художній виражений. Чітко заспівати направо плід зрідка медицина безглуздий.', true, 5, false);
INSERT INTO public.users VALUES (29, 2, '2025-07-11', 'Еріка', 'Заїка', '2003-08-14', 162, 63, 'Бажання ламати покоління пристрасть купа-невеличка. Міф банда вивести керівник.', true, 1, false);
INSERT INTO public.users VALUES (25, 3, '2025-07-11', 'Альбіна', 'Годунок', '2001-09-27', 180, 87, 'Ефект пити банк пастух затягнутися заборонити хліб. Олівець навіщо академік склянка кидати порада багряний.
Іспит пробувати райком.', true, 5, false);
INSERT INTO public.users VALUES (98, 2, '2025-07-11', 'Людмила', 'Гаврилець', '1987-03-25', 174, 92, 'Колишній потягнутися основа розгубитися нарада реклама адвокат. Космос ліхтарик синок паща. Купа низький художній фахівець пані викинути.', true, 1, false);
INSERT INTO public.users VALUES (99, 2, '2025-07-11', 'Алла', 'Єрмоленко', '1987-09-11', 159, 90, 'Звільнення червʼяк натиснути програміст єврейський. Казна-Хто ґазда вказаний застосовуватися дружно знищення диявол пристойний.', true, 3, false);
INSERT INTO public.users VALUES (41, 3, '2025-07-11', 'Надія', 'Хомик', '2003-04-02', 156, 77, 'Медицина оборот жити танцювати. Мати порада виражений склянка реклама трясти тривога один.', true, 1, false);
INSERT INTO public.users VALUES (84, 3, '2025-07-11', 'Михайлина', 'Ейбоженко', '1995-07-02', 168, 79, 'Ґаздиня серйозний написати промовчати ламати дошлий. Інтелектуальний вечір покидати здалеку легко. Темніти вираз знищення промовчати щастя.', true, 4, false);
INSERT INTO public.users VALUES (80, 2, '2025-07-11', 'Пріска', 'Рябошапка', '1996-02-07', 189, 70, 'А дорогий падати помовчати падаль розкішний здалеку. Услати податковий прем''єра господиня заклик в''язниця єдиний нога.
Упор юний прошепотіти спорт упор.', true, 3, false);
INSERT INTO public.users VALUES (82, 3, '2025-07-11', 'Тереза', 'Хмара', '2006-12-17', 180, 66, 'Склянка сміятися вітати щур бок. Почуття черевик їжа отже здригнутися близько інфекція.
Від''Їзд звільнити несподівано перебивати гіркий навіщо. Тривога рот інший гроші робочий чітко.', true, 7, false);
INSERT INTO public.users VALUES (88, 3, '2025-07-11', 'Вікторія', 'Іваничук', '1996-08-11', 168, 85, 'Команда ковзати більше світило валюта. Обуритися розлад вивести присвятити мигнути. Адвокат звільнити витягувати приятель витримати пісня.', true, 4, false);
INSERT INTO public.users VALUES (45, 1, '2025-07-11', 'Пантелеймон', 'Гаврюшенко', '2001-07-10', 170, 53, 'Яскраво салон отже шкарпетка правильний. Ґудзик зелений роса. Армійський більше відповідність вибирати помовчати гараж.', true, 9, false);
INSERT INTO public.users VALUES (27, 2, '2025-07-11', 'Варвара', 'Демʼянюк', '1996-03-17', 157, 63, 'Зарплата несподіваний міра гуляти. Конференція трясти так гіркий встати.
Лівий бочок нині. Який червонй інший навіщо їсти функція.', true, 3, false);
INSERT INTO public.users VALUES (101, 1, '2025-07-11', 'Еріка', 'Засядько', '1991-10-03', 156, 70, 'Розгубитися викинути інвалід бак.
Більше вчора синок салон різноманітний збудження. Казна-Хто фахівець один гіркий. Подробиця повністю заспівати повністю.', true, 7, false);
INSERT INTO public.users VALUES (47, 2, '2025-07-11', 'Златослава', 'Охріменко', '1988-08-06', 181, 67, 'Соціалістичний простір бочок кора новий червень. Тисяча збільшуватися призначити головка уникати почуття ремінь.', true, 7, false);
INSERT INTO public.users VALUES (35, 1, '2025-07-11', 'Тетяна', 'Сагаль', '1993-07-18', 187, 88, 'Командування дрібниця спасти насолода рис упор чотири. Основа лівий господь неправда ідея ідея інтернет.', true, 2, false);
INSERT INTO public.users VALUES (17, 2, '2025-07-11', 'Едита', 'Хомик', '1989-02-25', 186, 90, 'Товар очко банда академік адвокат. ЧервʼЯк інший розвернутися вмирати прірва жорстокий. Деякий їсти грати щастя.
Тисяча виражений заклик ефект зловити. Свіжий поставити коричневий.', true, 2, false);
INSERT INTO public.users VALUES (63, 2, '2025-07-11', 'Анжела', 'Євтушенко', '1987-07-01', 151, 94, 'Зате брову шкіра прощення кишеня лівий. Так ґазда актриса мета дорогий їжа.
Нестерпний тута вибирати сонце. Ламати співати за важкий.', true, 4, false);
INSERT INTO public.users VALUES (21, 1, '2025-07-11', 'Марʼяна', 'Вахній', '1992-07-05', 177, 52, 'Мить черевик летіти дальній ліворуч важкий каюта. Досліджено вітрина червень дорогий.
Плавно число провінція метелик пастух обуритися число.', true, 2, false);
INSERT INTO public.users VALUES (59, 2, '2025-07-11', 'Юстина', 'Таран', '2003-08-19', 160, 78, 'Роса перетнути трясти результат в''язниця. Пропадати поставити легко. Холодно труп синок тьмяний.
Робочий пропаганда інфекція один космос болото. Деякий художній боєць поїзд салон ніж.', true, 12, false);
INSERT INTO public.users VALUES (39, 3, '2025-07-11', 'Емілія', 'Пушкар', '2001-03-02', 181, 70, 'Виблискувати правління порода ґаздиня матерія направо вскакивать. Мета палиця розкішний прощення художній застосовуватися.
Виконувати райком метал. Степ прем''єра дихання.', true, 10, false);
INSERT INTO public.users VALUES (15, 1, '2025-07-11', 'Вадим', 'Лавренко', '1998-02-11', 199, 92, 'Пристрій загроза кора склянка заборонити теорія збільшуватися. Угодний присвятити інвалід незручно соціалістичний ланцюжок.
Склянка угодний хліб ліхтарик. Виражений розгубитися від''їзд порт заклад.', true, 12, false);
INSERT INTO public.users VALUES (11, 3, '2025-07-11', 'Марʼяна', 'Охримович', '1992-07-18', 174, 60, 'Багряний увійти пропадати заплакати сумний покидати. Пані розвернутися багаття порт звільнити жити недолік. Комунізм вигнати інший. Актриса тривога скинути звільнити.', true, 1, false);
INSERT INTO public.users VALUES (61, 1, '2025-07-11', 'Єлисавета', 'Коваленко', '1998-02-12', 196, 57, 'Щур діставати керівник поставити кордон диявол дружно. Заява епоха синок передо. Заплакати заспівати груди функція.', true, 12, false);
INSERT INTO public.users VALUES (33, 3, '2025-07-11', 'Камілла', 'Власенко', '1985-06-08', 179, 53, 'Дошлий бак звільнити адвокат господь квапливий похмуро пірʼя. Радити століття зате порада пити прихований тисяча.', true, 9, false);
INSERT INTO public.users VALUES (74, 2, '2025-07-11', 'Златослава', 'Запорожець', '2000-08-11', 151, 92, 'Прем''Єра рот незручно помовчати плід район. Адже секунда низький блискучий навіщо.', true, 4, false);
INSERT INTO public.users VALUES (85, 2, '2025-07-11', 'Марта', 'Забашта', '2003-12-28', 171, 100, 'Палиця природа зловити штаб адвокат взагалі близько зелений. Їжа обуритися прелесть колишній мимо.
Новий хата бетонний штаб. Іспит танцювати шкільний прірва гіркий заробити.', true, 7, false);
INSERT INTO public.users VALUES (73, 1, '2025-07-11', 'Захар', 'Гаврилишин', '1992-01-03', 174, 51, 'Черговий похорон оборот зміна. Домогтися склянка виникнення єдиний похмуро крутий. Конференція благати олівець червень.', true, 6, false);
INSERT INTO public.users VALUES (86, 1, '2025-07-11', 'Федір', 'Лазаренко', '1991-09-12', 180, 69, 'Чітко командування прелесть епоха мільярд перетнути. Прошепотіти рішення ґудзик рот. Інвалід вперед бок заборонити шкільний почуття наштовхнутися.', true, 1, false);
INSERT INTO public.users VALUES (49, 2, '2025-07-11', 'Ганна', 'Шаповал', '1998-03-08', 162, 76, 'Керівник їсти коричневий перетнути художній свіжий поріг. Покидати армійський виднітися єврейський тута термін забирати. Вперед коробка щастя житель так.', true, 3, false);
INSERT INTO public.users VALUES (75, 3, '2025-07-11', 'Маруся', 'Скоробогатько', '1997-01-15', 192, 54, 'Досліджено взагалі перетнути видимо ліхтарик потягнутися. Домогтися пірʼя незвичайний настати адже сміття народ.', true, 1, false);
INSERT INTO public.users VALUES (50, 1, '2025-07-11', 'Камілла', 'Джус', '1997-10-26', 189, 94, 'Провінція головний інфекція зупинити затягнутися керівник. Банда супроводжуватися що-небудь набір актриса незручно.', true, 2, false);
INSERT INTO public.users VALUES (55, 1, '2025-07-11', 'Орхип', 'Гречаник', '1999-01-19', 187, 73, 'Бажання червень направо. Рот оборот видимо монета.
Витягувати блискучий розводити кидати труп білизна пастух. Взагалі повністю неправда штаб. Плавно зрозумілий почуття танцювати академік пити.', true, 12, false);
INSERT INTO public.users VALUES (56, 3, '2025-07-11', 'Амалія', 'Демʼяненко', '1996-02-20', 182, 75, 'Холодно пропадати ґаздиня груди діставати єдиний. Народ що-небудь витягувати пані. Розкішний один вивести летіти синок вчора мить близько.', true, 9, false);
INSERT INTO public.users VALUES (6, 2, '2025-07-11', 'Анастасія', 'Дзюба', '1999-08-03', 190, 73, 'Пробувати пропаганда незвичний самостійно ґазда прохід хата. Нарада присвятити ідея іспит. Призначити тривога фахівець покинути прощення.', true, 6, false);
INSERT INTO public.users VALUES (87, 3, '2025-07-11', 'Михайлина', 'Єрьоменко', '1991-12-10', 187, 86, 'Інший ліворуч затримати подвірʼя паща. Ліворуч інвалід заспокоїтися покоління. Хлопчисько натиснути нарада князь.', true, 5, false);
INSERT INTO public.users VALUES (76, 1, '2025-07-11', 'Демʼян', 'Фастенко', '1986-07-20', 178, 80, 'Упустити ліворуч розгубитися розкішний засунути точно медицина означати. Спорт скинути фахівець вовк факультет.', true, 3, false);
INSERT INTO public.users VALUES (7, 1, '2025-07-11', 'Мирон', 'Онищенко', '1987-10-22', 174, 96, 'Передо вибирати вказаний спалити пірʼя полюбити ягода. Хліб призначити робочий засунути вираз.
Кпсс холодно поїзд. ПодвірʼЯ затягнутися навіщо зелений. Степ податковий провінція легко приходити.', true, 1, false);
INSERT INTO public.users VALUES (5, 2, '2025-02-06', 'Маруся', 'Дахно', '2003-05-08', 182, 59, 'Порода редактор кидати набір незвичайний розкішний радість. Вмирати плавно дорогий шкільний. Покидати зима прем''єра сумний через промовчати низький.', true, 4, false);
INSERT INTO public.users VALUES (3, 2, '2025-07-11', 'Альбіна', 'Усик', '1993-08-09', 183, 64, 'Паща нога художній ґаздиня покидати ламати. Спорт мільярд ідея передо діставати матерія. Ідея рідкий коваль степ.', true, 5, false);
INSERT INTO public.users VALUES (95, 3, '2025-07-11', 'Марта', 'Атаманюк', '2000-05-30', 171, 67, 'Валюта лівий прошепотіти житель. Щастя від''їзд бетонний вечір падаль діловий видимо.', true, 12, false);
INSERT INTO public.users VALUES (89, 2, '2025-07-11', 'Ганна', 'Москаль', '1993-05-14', 172, 70, 'Правий гіркий плід. Блін скинути заклад.', true, 2, false);
INSERT INTO public.users VALUES (64, 3, '2025-07-11', 'Пріска', 'Черінько', '1993-09-29', 168, 100, 'Секунда закласти болото інтернет близько. Поставити який правий податковий щось несподіваний ґудзик. Надати щур відділ натиснути.', true, 1, false);
INSERT INTO public.users VALUES (90, 3, '2025-07-11', 'Амалія', 'Левченко', '1985-04-10', 158, 75, 'Залучати підземний райком інструкція. Теорія очко танцювати ленінград неправда. Недолік байдужий вчений коричневий. Пані застосовуватися нині присвятити медицина степ.', true, 1, false);
INSERT INTO public.users VALUES (92, 2, '2025-07-11', 'Златослава', 'Скирда', '2002-09-08', 174, 82, 'Хліб нині упустити шолом подвірʼя.
Мотоцикл затримати хліб ставити здригатися ліхтарик упустити. Прірва академік падати зарплата безглуздий щур.', true, 9, false);
INSERT INTO public.users VALUES (91, 2, '2025-07-11', 'Валентина', 'Ґерета', '1992-06-09', 196, 100, 'Світило розуміти незручно метал. Основа зарплата будівництво інструкція. Прощення пристрій монета прощення угодний. Адже рота легко промовчати.', true, 7, false);
INSERT INTO public.users VALUES (4, 2, '2025-07-11', 'Надія', 'Гавриш', '1998-08-04', 152, 69, 'Ґазда сміття головний навряд вивести ліловий.
Товар уточнити байдужий. Небезпека покинути відділ болісно. Образа конференція тривога залучати покидати адвокат.', true, 11, false);
INSERT INTO public.users VALUES (81, 3, '2025-07-11', 'Орина', 'Деряжна', '2006-10-14', 186, 64, 'Коробка написати подробиця рис вітрина означати. Виражений інтернет мигнути зима. Похмуро ґаздиня взагалі інтелектуальний надати бігати.', true, 4, false);
INSERT INTO public.users VALUES (28, 1, '2025-07-11', 'Дмитро', 'Батюк', '2006-07-21', 167, 69, 'Приходити мить кишеня торгівля промовчати ніж. Уникати серйозний академік шкарпетка. Навіщо занадто тута хлопець що-небудь нестерпний.', true, 7, false);
INSERT INTO public.users VALUES (69, 2, '2025-07-11', 'Ліза', 'Величко', '1985-11-07', 176, 95, 'Небезпека картинка о страта рідкий мета жорстокий банда. Вибирати блискучий летіти польовий свіжий спасти.', true, 6, false);
INSERT INTO public.users VALUES (12, 3, '2025-07-11', 'Сніжана', 'Вакуленко', '1988-11-06', 158, 50, 'Деякий зупинити олівець медицина правління спорт виднітися. Терапія банк блін гуляти різноманітний порода виблискувати покидати. Співати другий засунути зрозумілий радити яскраво хліб.', true, 12, false);
INSERT INTO public.users VALUES (78, 2, '2025-07-11', 'Христина', 'Єфименко', '1996-02-28', 163, 87, 'Протягувати взагалі який неправда забирати. Очко співрозмовник червонй чоловічок простір приятель. Пропаганда розлад салон.', true, 11, false);
INSERT INTO public.users VALUES (14, 3, '2025-07-11', 'Анжела', 'Швачко', '1989-08-14', 180, 96, 'Сходити низький ламати розгубитися монета. Порт торгівля гіркий поріг щур. Мільярд кишеня так бігати.
Терапія виникнення простір інтелектуальний знищення брову їсти. Мотоцикл висіти новий покинути.', true, 12, false);
INSERT INTO public.users VALUES (52, 2, '2025-07-11', 'Амалія', 'Щербак', '1996-10-10', 193, 52, 'Один порода благати мить пісня. Танцювати діловий упор точно пристойний результат домогтися вигнати.', true, 8, false);
INSERT INTO public.users VALUES (54, 1, '2025-07-11', 'Веніямин', 'Баштан', '2005-10-06', 180, 98, 'Виникнення лягати незручно зима хлопець.', true, 3, false);
INSERT INTO public.users VALUES (46, 3, '2025-07-11', 'Роксолана', 'Заруба', '2002-07-09', 192, 50, 'Мигнути вибирати інвалід дружно валюта здригнутися закласти рішення. Ґудзик блискучий поява зміна століття запустити лапа.
Мить легко падати монета.', true, 2, false);
INSERT INTO public.users VALUES (102, 1, '2025-07-11', 'Лариса', 'Їжакевич', '2004-01-12', 169, 73, 'Покоління шкарпетка друкувати що трясти знищення. Заробити темніти командувач що-небудь прихований природа ліворуч сумний.
Приходити житель ягода помовчати намір полум''я.', true, 3, false);
INSERT INTO public.users VALUES (44, 1, '2025-07-11', 'Вадим', 'Батіг', '1987-01-25', 163, 70, 'ПірʼЯ польовий вираз відзначити пастух. Кпсс наполегливо господиня мить. Падати повністю палата.
Гіркий мільярд зелений бок підкинути. Дрімати здригнутися гіркий чітко хліб палець.', true, 5, false);
INSERT INTO public.users VALUES (104, 2, '2025-08-12', 'heh', ':3', '1973-10-10', NULL, NULL, NULL, false, 9, false);
INSERT INTO public.users VALUES (106, 2, '2025-08-12', 'qwe', 'qwe', '1999-08-19', 170, 65, '[r[', false, 7, false);
INSERT INTO public.users VALUES (32, 3, '2025-07-11', 'Златослава', 'Павленко', '1997-10-30', 170, 59, 'Почуття прохід єдиний перед пісня багряний заява. Жорстокий брову присвятити виникнення плід сміливий. Перед степ приходити.', true, 3, false);
INSERT INTO public.users VALUES (96, 2, '2025-07-11', 'Галина', 'Чайка', '1995-11-17', 188, 54, 'Струмок кільце армійський інший. Порада кора головка о співати отже олівець аналіз. Мільярд точно правління знищення відділ квапливий радити. Решітка передо роса лягати бетонний.', true, 2, false);
INSERT INTO public.users VALUES (10, 1, '2025-07-11', 'Пантелеймон', 'Яценко', '2004-09-04', 184, 100, 'Прірва збільшуватися коробка поява. Число приятель підлога упустити монета. М''Який їсти боєць очко.
Набір поріг промовчати провал мета єдиний. Природний виднітися направо гіркий бак степ червень.', true, 1, false);
INSERT INTO public.users VALUES (36, 3, '2025-07-11', 'Тетяна', 'Андрієвич', '2007-06-26', 172, 53, 'Дівка штаб трубка лівий хлопець отже житель. Зловити видимо товар художній радість важкий.
Нестерпний ефект бок. Поріг міра вперед. Услати танцювати червонй покоління колишній темніти важливий.', true, 12, false);
INSERT INTO public.users VALUES (16, 2, '2025-07-11', 'Емілія', 'Єрошенко', '2007-05-09', 158, 77, 'Лапа заспокоїтися пропадати. Район покидати теорія потрясти наполегливо. Результат а колектив яскраво п''ятеро.
Зображати навіщо нервово за порода конференція хотіти.', true, 8, false);
INSERT INTO public.users VALUES (20, 1, '2025-07-11', 'Лілія', 'Даниленко', '1988-11-28', 188, 56, 'Засунути мимо настати мʼята монета палиця. Зате гроші важкий ліловий прощення. Правильний кидати бігати.', true, 11, false);
INSERT INTO public.users VALUES (34, 3, '2025-07-11', 'Ада', 'Рябошапка', '2006-11-09', 151, 77, 'Степ розкішний закласти коробка склянка плід. Прелесть правий летіти упор.
Житель художній ланцюжок помовчати бак. Видимо плід скинути художній червʼяк пристойний наступати ставити.', true, 4, false);
INSERT INTO public.users VALUES (22, 3, '2025-07-11', 'Наталія', 'Гаврилишина', '1989-05-19', 196, 82, 'Потягнутися дихання здригатися співати.
Заява сходити через основа. Ставити дрібниця палиця різноманітний подробиця зображати банда. Зима поріг інструкція прошепотіти аналіз.', true, 6, false);
INSERT INTO public.users VALUES (38, 3, '2025-07-11', 'Клавдія', 'Овчаренко', '2007-01-22', 157, 89, 'Знімати правий князь образа. За олівець коробка мотоцикл розводити медицина.', true, 3, false);
INSERT INTO public.users VALUES (18, 1, '2025-07-11', 'Михайло', 'Баштан', '2004-01-14', 188, 79, 'Постійний розстебнути тривога хотіти дрібниця. Підлога порівняння потім пісня друкувати. Зупинити функція відзначити забирати мотоцикл.', true, 12, false);
INSERT INTO public.users VALUES (60, 1, '2025-07-11', 'Зорян', 'Гриценко', '1987-10-17', 167, 87, 'Доба виблискувати похмуро нині райком близько. Відповідність блискучий що покинути інфекція.
Похмуро дружно сонце покинути. Збудження мотоцикл вираз очко.', true, 5, false);
INSERT INTO public.users VALUES (58, 2, '2025-07-11', 'Ольга', 'Заруба', '1991-05-15', 163, 88, 'Космос вибирати точно що міркування. Розстебнути ефект степ програміст сміятися процес.
Соціалістичний космос пропадати рот. Тривога солома хід дрібниця ламати. Кут покинути виднітися.', true, 4, false);
INSERT INTO public.users VALUES (24, 3, '2025-07-11', 'Анжела', 'Алексеєнко', '2006-12-15', 167, 85, 'Червонй потрясти ручка сміятися ідея факультет. Збільшуватися незручно потягнутися купа поставити бок. Відділ гуляти кишеня тута. Ідея народ процес художній.', true, 5, false);
INSERT INTO public.users VALUES (40, 2, '2025-07-11', 'Єва', 'Шеремета', '2000-09-06', 176, 83, 'Заплакати слати закласти гроші. Поява витримати летіти художній порада хлопчисько несподівано.
Здригатися блін мотоцикл зате отже. Кільце інтернет район.', true, 7, false);
INSERT INTO public.users VALUES (62, 1, '2025-07-11', 'Аврелій', 'Данчук', '1994-05-01', 150, 81, 'В''Язниця забирати пропадати страта інший. Щур зупинити потрясти набір образа блискучий. Вечір лягати несподіваний приятель ліворуч звільнення.', true, 5, false);


--
-- Data for Name: zodiac_compatibility; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.zodiac_compatibility VALUES (1, 1, 1, 75, 'Може здатися дивним уявити Водолія, закоханого в іншого Водолія. Коли ви вивчаєте астрологію, одне з перших речей, які ви дізнаєтеся, це те, що Водолій є знаком розлучень, розривів і звільнення від режимів та стосунків. Як знак, що несе в собі протиріччя, Водолію часто нелегко спілкуватися з будь-яким іншим знаком зодіаку, але саме це вони можуть зрозуміти один в одному. Якщо вони по-справжньому поважають один одного, є велика ймовірність, що вони навчаться розуміти й інші аспекти життя один одного. Як би божевільно це не звучало, ці двоє партнерів мають великі шанси залишитися разом, тому що вони знатимуть один одного краще, ніж будь-хто інший. Однак вони рідко відчувають сильну привабливість один до одного, і навіть коли це трапляється, їм дуже важко сформувати глибокий емоційний зв''язок. Коли ж це трапляється, то... небо не є межею.');
INSERT INTO public.zodiac_compatibility VALUES (2, 1, 2, 40, 'Як і всі сусідні знаки, Водолій і Риби не завжди найкраще розуміють особистість один одного. Однак знак Водолія підносить Нептуна, правителя Риб, і це дає їм міцний зв''язок через планету всієї магії. Нелегко створити казкову версію цього контакту, але як тільки вони знайдуть емоційну рівновагу і єдину, основну істину один для одного, вони без проблем зможуть підтримувати свою казку, день за днем.');
INSERT INTO public.zodiac_compatibility VALUES (3, 1, 3, 70, 'Овен і Водолій створюють незвичайну та цікаву пару з елементів вогню і повітря, де обидва партнери цінують свободу та нові ідеї. Сміливість та ініціативність Овна гармонійно доповнюється винахідливістю і незалежністю Водолія – разом вони генерують безліч оригінальних планів і з радістю втілюють їх у життя. Їхні стосунки сповнені дружнього тепла та веселощів: Водолій захоплюється щирістю і силою Овна, а Овен поважає інтелект і нестандартний погляд на світ партнера. Іноді емоційно відсторонений Водолій може здаватися Овну занадто холодним, а Овен для Водолія – занадто вимогливим, але вони здатні швидко знаходити компроміс завдяки взаємній повазі. Коли ця пара підтримує одне одного у мріях і починаннях, їхнє кохання розквітає – яскраве, вільне та натхненне спільними пригодами.');
INSERT INTO public.zodiac_compatibility VALUES (4, 1, 4, 40, 'Телець і Водолій – незвична пара з протилежними поглядами, де зіткнулися традиційність землі та бунтівливість повітря. Консервативний Телець живе реальними справами і цінує звичний порядок, тоді як Водолій – яскрава індивідуальність, новатор і мрійник, який прагне змін та експериментів. Спочатку різниця може навіть притягувати: Водолій з цікавістю вчиться у Тельця терпінню і теплоті, а Телець піддається чарівності розуму і оригінального мислення партнера-Водолія. Згодом конфліктів не уникнути: Тельця засмучують непередбачуваність і емоційна відстороненість Водолія, а Водолію здається, що Телець надто впертий і скутий рамками. Цим знакам важко порозумітися без компромісів, але якщо вони щиро кохають, то можуть спробувати збалансувати різні світи – Телець дарує стосункам сталість і тепло, а Водолій привносить у них свіжість і захопливість.');
INSERT INTO public.zodiac_compatibility VALUES (5, 1, 5, 95, 'Близнюки і Водолій – блискучий союз двох повітряних стихій, де панують інтелект, дружба і взаємна свобода. Обидва знаки люблять нове та незвичайне: Близнюки невтомно генерують ідеї, а оригінальний Водолій із захопленням підхоплює їх – разом вони утворюють креативний і дуже товариський дует. Їхня емоційна прив’язаність будується на глибокому інтелектуальному зв’язку: вони годинами говорять про все на світі, розуміючи одне одного з півслова, та підтримують особисту незалежність партнера. Жоден з них не обмежує іншого – навпаки, вони надихають на розвиток та поважають індивідуальність: Водолій цінує дотепність і гнучкість Близнюків, а Близнюки захоплюються гуманністю і сміливими поглядами Водолія. Це майже ідеальна пара, в якій панує легкість і довіра: їхнє кохання нагадує яскраву дружбу, переповнену ніжністю, спільними мріями і взаємною підтримкою.');
INSERT INTO public.zodiac_compatibility VALUES (77, 11, 12, 40, 'Це не ідеальні стосунки, і вони рідко стають тими, в яких обоє вирішують залишитися на все життя. Проте, їхнє розуміння та прийняття своїх відмінностей є освіжаючим і веселим для обох партнерів, і вони можуть добре проводити час разом, незалежно від того, як довго це триватиме. Ми не можемо передбачити надто велику стабільність, якщо тільки Козеріг не вирішить її створити, але посмішка на обличчі Стрільця і його здатність розсмішити партнера можуть бути опорою їхнього зв''язку стільки, скільки їм обом це потрібно.');
INSERT INTO public.zodiac_compatibility VALUES (6, 1, 6, 10, 'Рак і Водолій – один з найменш ймовірних союзів, де традиціоналіст і домосід Рак намагається порозумітися з бунтівним і незалежним Водолієм. Емоційний Рак прагне близькості, передбачуваності і взаємної турботи, тоді як інтелектуальний Водолій цінує свободу, має безліч друзів та захоплень і часто емоційно відсторонений. Спочатку Рак може зацікавитися оригінальністю Водолія і його широким світоглядом, а Водолія приваблює доброта і щирість Рака – вони бачать одне в одному щось екзотичне. Однак дуже швидко Рак починає страждати від браку уваги та тепла, які не завжди здатен дати віддалений партнер, а Водолій відчуває тиск від надмірної чутливості та прив’язаності Рака. Зазвичай ці стосунки довго не тривають – надто вже різні їхні потреби – але якщо вони спробують зрозуміти один одного, то можуть навчитися цінним речам: Рак – трохи більше свободи, а Водолій – трохи більше душевності.');
INSERT INTO public.zodiac_compatibility VALUES (7, 1, 7, 60, 'Лев і Водолій – протилежності на зодіакальному колі (вогонь і повітря), їхній союз тримається на взаємному притяганні та одночасно викликах. Леву подобається оригінальність, розум та незалежний характер Водолія – він бачить у ньому цікавого співрозмовника і особистість, яка не підкоряється натовпу, а Водолія захоплює сила, щедрість і яскравість Лева. Спочатку між ними виникає сильний інтерес: вони багато спілкуються, діляться ідеями, разом втілюють креативні плани, їх фізична та інтелектуальна сумісність на високому рівні. Згодом проблеми можуть виникнути через різні потреби: Лев хоче більше емоційної близькості, поклоніння і традиційного вираження любові, а Водолій цінує дружнє партнерство, свободу і може здаватися Леву занадто відстороненим чи холодним – це неймовірно дратує та ранить Лева. Якщо вони навчаться приймати особливості одне одного – Лев дасть Водолію щире серце і лідерство, а Водолій подарує Леву нові погляди і простір для розвитку – їхній союз може стати незвичайним, але напрочуд плідним коханням, сповненим взаємоповаги.');
INSERT INTO public.zodiac_compatibility VALUES (8, 1, 8, 30, 'Діва може уособлювати все те, від чого тікає Водолій – практичність, турботу про здоров''я та земні справи, приземленість, манію до чистоти. Уявіть, наскільки безвідповідальним, хаотичним і нереалістичним Водолій виглядає в їхніх очах. Найсильніша точка дотику між ними – це раціональність і комунікабельність, і це можна використовувати для подолання багатьох проблем, що виникають через їхні відмінності. На жаль, у більшості випадків між ними не буде достатньої хімії, щоб почати стосунки, не кажучи вже про те, щоб довго залишатися в сексуально задовільних стосунках. Якщо вони ставитимуться один до одного серйозно, то можуть створити разом неймовірні речі, оскільки їхні великі уми злиються воєдино.');
INSERT INTO public.zodiac_compatibility VALUES (9, 1, 9, 70, 'Між партнерами-Терезами і Водоліями існує сильне взаєморозуміння завдяки їхньому спільному елементу Повітря. Проте, їхнім неспокійним Сонцям може бути досить складно порозумітися, і вони часто матимуть труднощі з пристосуванням до характеру один одного та знаходженням глибокої поваги один до одного. Найкращим ліком від будь-яких проблем у їхніх стосунках зазвичай є час, але через потребу Водоліїв у спонтанності вони часто не протримаються достатньо довго, щоб час зміг виправити те, що було зруйновано. Якою б не була їхня історія, вони переживуть разом багато цікавих подій, і якщо вони закохаються, то для такої пари було б шкода не спробувати побудувати стосунки, як би вони не закінчилися.');
INSERT INTO public.zodiac_compatibility VALUES (10, 1, 10, 30, 'Хтось може сказати, що це кармічні стосунки, що ці партнери були ворогами в одному зі своїх попередніх життів і що вони можуть боротися, поки один з них не загине. Однак це було б дещо надмірним. Правда в тому, що Скорпіон є знаком екзальтації Урана і, як такий, він певним чином обожнює Водолія. У більшості випадків партнер-Скорпіон буде одержимо виявляти свою прихильність, але Водолію це може бути навіть приємно. Якщо подивитися на знак Водолія, то ми побачимо, що він підносить Нептун, правителя водного знака Риб, і всі наші припущення про їхню емоційну холодність потонуть у їхній безмежній любові. Справа в тому, що вони обидва є в певному сенсі ізгоями і бунтівниками. Скорпіон уособлює всі наші емоції, з якими ми не хочемо мати справу, а Водолій уособлює спосіб мислення, до якого більшість з нас не готова. Найкраще розглядати їх як провісників змін, бо саме це вони принесуть у життя одне одного.');
INSERT INTO public.zodiac_compatibility VALUES (11, 1, 11, 85, 'Стосунки між Стрільцем і Водолієм можуть здаватися іншим людям дружбою між особами однієї статі, і що б вони про це не думали, саме такі стосунки можуть бути потрібні обом партнерам. Вони зустрінуться, коли для обох настане час змін у житті або коли вони захочуть розлучитися з партнером, який їх обмежує. Їхні стосунки часто є яскравим прикладом для всіх навколо, оскільки вони ставлять на перше місце майбутнє і дають надію на кращі часи. Головна проблема Стрільця і Водолія полягає в їхній раціональній природі. Хоча їхні розуми будуть чудово ладнати, їм може бути важко досягти справжньої близькості та інтимності. Їм обом потрібно сповільнитися і запитати себе, що вони відчувають, перш ніж опинитися в бездушних стосунках, в яких вони знаходять розраду, тікаючи від світу.');
INSERT INTO public.zodiac_compatibility VALUES (12, 1, 12, 40, 'Козеріг і Водолій спочатку можуть не вважати один одного цікавими. Обидва ці знаки традиційно перебувають під владою Сатурна, але їхні ролі в зодіаку абсолютно різні. Найскладнішим моментом у їхніх стосунках є емоційний контакт. Якщо вони хочуть залишитися разом, Козеріг повинен трохи відірватися від землі, а Водолій — трохи наблизитися до неї. Їм потрібно знайти золоту середину, щоб Козеріг міг допомогти Водолію втілити його ідеї, а Водолій — допомогти Козерігу внести необхідні зміни в його життя і звернутися до чогось нового.');
INSERT INTO public.zodiac_compatibility VALUES (13, 2, 2, 75, 'Двоє партнерів-Риб будуть мати проблеми з довірою один до одного. Їх мінлива натура буде постійно змінювати їхні стосунки, і тільки якщо вони поділяють достатньо любові, вони зможуть впоратися зі змінами і залишитися разом. У');
INSERT INTO public.zodiac_compatibility VALUES (14, 2, 3, 25, 'Овен і Риби – одна з найскладніших пар зодіаку, у якій прямолінійний вогонь зустрічається з чутливою водою. Романтичні, мрійливі Риби прагнуть глибокого емоційного зв’язку і делікатності, тоді як відвертий та запальний Овен іноді буває занадто різким для тонкої душі Риб. Між ними можливе сильне притягання протилежностей: Овен спершу захоплюється загадковістю і добротою Риб, а Риби бачать в Овні сміливого захисника. Проте з часом різниця темпераментів дається взнаки – Овен може випадково поранити почуття вразливих Риб своєю нетактовністю, а Риби, закриваючись у своїх образах, віддаляються від партнера. Цим двом потрібне велике терпіння і розуміння: якщо Овен навчиться ніжності, а Риби – більшої відкритості, то навіть такий контрастний союз може знайти шлях до гармонії через щире кохання та співчуття.');
INSERT INTO public.zodiac_compatibility VALUES (15, 2, 4, 90, 'Телець і Риби – дивовижно гармонійне поєднання земної практичності та водної чуттєвості. Ніжні Риби відчувають себе захищеними поруч із сильним і турботливим Тельцем, а Телець зачарований м’яким романтизмом та глибокою духовністю Риб. Їхні стосунки сповнені доброти, співчуття і тихої радості: вони інтуїтивно розуміють емоції одне одного, поділяють любов до мистецтва, природи чи спільних мрій. Телець допомагає мрійливим Рибам відчувати ґрунт під ногами, підтримує їхні фантазії реальними діями, натомість Риби наповнюють життя Тельця натхненням, романтикою та глибокими почуттями. Ця пара має всі шанси на щасливе майбутнє: їхнє кохання щире, лагідне і міцне, бо кожен готовий віддати партнеру тепло свого серця і прийняти його таким, яким він є.');
INSERT INTO public.zodiac_compatibility VALUES (16, 2, 5, 5, 'Близнюки та Риби – майже полярні протилежності, яким дуже важко знайти спільну хвилю у стосунках. Легкі і раціональні Близнюки живуть розумом і словами, тоді як мрійливі емоційні Риби – серцем і інтуїцією, через що вони ніби говорять різними мовами. Спершу Риби можуть захопитися веселістю та гострим розумом Близнюків, а тим, своєю чергою, подобається загадкова чуттєвість Риб. Але дуже швидко непорозуміння переважають: Близнюкам важко задовольнити глибоку потребу Риб у ніжності і підтримці, а Риби відчувають себе розгубленими через мінливість і відстороненість партнерів-Близнюків. Для успіху цієї пари потрібне справжнє диво або велика любов: лише неймовірна терплячість Риб і небачена уважність Близнюків могли б допомогти їм побудувати крихкий місточок взаєморозуміння.');
INSERT INTO public.zodiac_compatibility VALUES (17, 2, 6, 89, 'Рак і Риби – дві споріднені водні душі, що творять ніжний, майже казковий роман. Вони чудово розуміють почуття одне одного: інтуїтивні Риби співпереживають кожному настрою Рака, а дбайливий Рак створює Рибам безпечний простір, де можна мріяти і бути собою. Їхній зв’язок глибоко емоційний і духовний – вони можуть мовчати разом, просто відчуваючи присутність партнера, і це буде для них найбільшим щастям. Конфлікти між ними трапляються рідко, хіба що обидва іноді заглиблюються у свої образи замість одразу про них сказати, але ніжність і любов швидко допомагають їм усе вирішити. Це дуже теплий і зворушливий союз: Рак і Риби надихають та підтримують одне одного, їхнє кохання сповнене романтики, взаємної відданості та тонкого взаєморозуміння на рівні сердець.');
INSERT INTO public.zodiac_compatibility VALUES (18, 2, 7, 10, 'Лев і Риби – союз, сповнений романтики та складнощів, де сонячний вогонь зустрічається з місячною водою. Щедрий, відкритий Лев живе на повну, прагнучи слави і активного життя, а мрійливі, тонко відчуваючі Риби більше зосереджені на внутрішньому світі, емоціях та духовності. Спочатку Лева зворушує ніжність і загадковість Риб – йому хочеться захищати і оберігати цього ніжного партнера, а Риби захоплюються яскравістю і впевненістю Лева, відчуваючи поруч із ним захист. Але згодом різниця стає надто відчутною: Лев може ненароком ранити тендітних Риб своєю прямотою або зайнятістю власною персоною, а Риби для Лева надто вразливі, потайні і незрозумілі – Леву важко бути з тим, хто ховається в тіні. Цей союз тримається хіба що на великому коханні або компромісі: якщо Лев проявить більше чуйності і м’якості, а Риби наберуться сміливості висловлювати свої потреби, тоді навіть така непроста пара може знайти моменти справжнього щастя.');
INSERT INTO public.zodiac_compatibility VALUES (19, 2, 8, 90, 'Діва і Риби представляють вісь піднесення і падіння як Венери, так і Меркурія. Це робить їх партнерами з найбільшими викликами і найбільшим потенціалом для кохання у всьому зодіаку. Їм потрібно знайти тонкий баланс між раціональністю і емоціями, кожному окремо і разом через свої стосунки. У багатьох випадках це не та пара, яка протримається дуже довго, оскільки їхня мінлива природа робить їх достатньо мінливими, щоб швидко знехтувати всіма стосунками, якщо вони не задоволені. Їм потрібно усвідомити, що досконалість, якої вони прагнуть, може не бути представлена у тій формі, якої вони очікують. Якщо вони залишаться разом достатньо довго, щоб зрозуміти переваги своїх стосунків, вони можуть відкрити, що любов між ними є єдиною справжньою любов''ю, яку вони можуть знайти в цьому житті.');
INSERT INTO public.zodiac_compatibility VALUES (20, 2, 9, 30, 'Терези та Риби мають спільну точку дотику в красі Венери. Проте вони сприймають її по-різному і часто не поважають одне одного настільки, щоб побачити красу Венери в партнері. Їм може бути дуже важко пристосуватися до темпу свого партнера, а мінливий характер Риб часто не допомагає їм швидше відкритися, щоб побудувати стосунки в темпі, який би підходив їхньому партнеру-Терезам. І Терези, і Риби можуть безкорисливо цікавитися задоволенням свого партнера, і це повинно допомогти їм залишатися в хороших стосунках, що б між ними не трапилося. Якщо вони подолають неповагу і нереалістичні очікування від особистості один одного, вони можуть виявити, що їх об''єднує справжня любов.');
INSERT INTO public.zodiac_compatibility VALUES (21, 2, 10, 80, 'Коли Скорпіон і Риби зустрічаються, ці стосунки, ймовірно, дадуть їм обом нові уявлення про емоційні можливості. Вони обоє легко захопляться образом казкового кохання, і цей образ може тримати їх разом дуже довго, навіть якщо вони обоє не дуже щасливі. Як два знаки Води, вони будуть покладатися на свої емоційні судження і розуміти це один в одному, створюючи справжню близькість. Виклик тут полягає в тому, щоб Скорпіон не зациклювався і не душив свого мінливого партнера, а Риби перестали тікати від негативних емоцій.');
INSERT INTO public.zodiac_compatibility VALUES (78, 12, 12, 80, 'Незважаючи на те, що вони є представниками одного і того ж знака зодіаку, кожен Козеріг є індивідуальністю зі своїми цінностями, які не підлягають зміні. Козерігу нелегко знайти іншого Козеріга, який би поділяв його цінності. Жорсткий характер Козерога не дозволяє йому з розумінням ставитися до поведінки, яка «не схвалюється», і бути Козерогом не виключає нікого з первинних рівнянь, які встановлює кожен з них. Вони повинні дотримуватися цінностей, які вони поділяють, замість того, щоб ставити під сумнів ті, які їм не подобаються.');
INSERT INTO public.zodiac_compatibility VALUES (22, 2, 11, 50, 'Стосунки між Рибами та Стрільцем – це стосунки двох споріднених душ, які часто не тривають дуже довго. Спочатку їм буде складно вийти за межі платонічної зони і почати будувати фізичні стосунки. Як тільки вони зблизяться, почнеться процес пізнання, і обоє партнерів будуть зачаровані одне одним, думаючи, що їхні стосунки ніколи не закінчаться. Вони легко ідеалізують одне одного, вважають свої стосунки ідеальним коханням, але це захоплення не триватиме довго через їхню мінливу натуру. Насправді їхні стосунки є миттю в часі, коли вони обоє заслужили на посмішку. Поки вони тривають і вони щасливі, вони будуть дорогі обом.');
INSERT INTO public.zodiac_compatibility VALUES (23, 2, 12, 75, 'Стосунки між Козерогом і Рибами розповідають історію про можливості натхнення. Якщо хтось на зразок Козерога може бути втягнутий у божевільну історію кохання, захоплюючу і непередбачувану, то це має зробити Риби. Натомість Козеріг запропонує своєму партнеру-Рибам стабільність, спокій і деякий відпочинок від їхніх звичних емоційних бур. Є чудовий спосіб, за допомогою якого Козеріг може допомогти Рибам бути більш реалістичними і практичними, водночас відчуваючи себе більш веселими і оптимістичними. Проте, у їхніх стосунках є певні виклики, які в основному пов''язані з їхньою любов''ю до Юпітера. Їм може бути важко погодити свої різні підходи до релігії, віри та різних систем переконань. Щоб подолати це, найкраще, якщо вони обоє запитають себе: чи працює їхня система переконань? І чи працює система переконань їхнього партнера? Якщо вони зрозуміють відповіді на ці питання, вони можуть знайти достатньо поваги, щоб залишити Юпітер один одного недоторканим.');
INSERT INTO public.zodiac_compatibility VALUES (24, 3, 3, 90, 'Два Овни утворюють яскравий і динамічний союз. Обидва є вогняними знаками під впливом Марса, тому їх відносини наповнені пристрастю та енергією. Їхній роман кипить азартом і сміливими пригодами, адже кожен партнер надихає іншого на нові звершення. Однак два лідери в парі можуть змагатися за головну роль, тому їм важливо вчитися поступатися і контролювати свій запал. Якщо Овни виявлять терпіння і повагу, їхній гарячий союз може стати міцним та щасливим, адже вони чудово розуміють вогняну натуру одне одного.');
INSERT INTO public.zodiac_compatibility VALUES (25, 3, 4, 45, 'Овен (вогонь) і Телець (земля) – це пара протилежних темпераментів, де імпульсивність стикається зі спокоєм. Запальний Овен прагне пригод і швидких змін, тоді як терплячий Телець любить стабільність і повільний ритм життя. Спочатку між ними може виникнути сильний фізичний потяг – Овна приваблює ніжність Тельця, а Тельця зачаровує сміливість Овна. Проте у буденному житті їм нелегко: Овен може нетерпляче підганяти обережного партнера, а впертий Телець не завжди готовий йти на поступки. Якщо вони навчаться компромісу – Овен внесе в стосунки пристрасть, а Телець подарує їм надійність – то ця різнобарвна пара матиме шанс на гармонійне кохання.');
INSERT INTO public.zodiac_compatibility VALUES (26, 3, 5, 80, 'Овен і Близнюки утворюють жвавий та веселий тандем, що базується на поєднанні вогню і повітря. Енергійний Овен та допитливі Близнюки швидко знаходять спільну мову – їх приваблює дух пригод та любов до нових вражень. У романі між ними панує легкість і грайливість: вони багато спілкуються, сміються та спільно вигадують сміливі плани. Іноді Близнюкам може бракувати глибини емоцій Овна, а Овен часом ревнує до мінливої природи партнерів-Близнюків. Попри дрібні непорозуміння, ця пара зазвичай щаслива разом – їхнє життя наповнене рухом, теплими почуттями та взаємним надиханням.');
INSERT INTO public.zodiac_compatibility VALUES (27, 3, 6, 45, 'Овен і Рак – складне поєднання вогню та води, де палка відвертість зустрічається з ніжною чуттєвістю. Сміливий Овен захоплюється добротою і романтизмом Рака, а Рака водночас приваблює сила та впевненість партнера-Овна. На початку між ними може спалахнути пристрасне тяжіння, але з часом різниця характерів стає відчутною. Ранимого Рака можуть ображати прямолінійні слова Овна, а Овен не завжди розуміє тонкі емоції партнера, через що виникають образи. Якщо вони навчаться чути одне одного – Овен проявить більше ніжності, а Рак спробує бути сміливішим – ця пара зможе знайти теплоту та підтримку у стосунках.');
INSERT INTO public.zodiac_compatibility VALUES (28, 3, 7, 90, 'Овен і Лев – дві іскри одного вогню, що створюють яскравий і гармонійний союз. Обидва – сильні, впевнені знаки, наділені лідерськими якостями та невичерпною енергією, тому разом вони відчувають взаємне захоплення. Їхні романтичні стосунки сповнені пристрасті, веселощів і щирого захоплення одне одним – Лев обожнює ініціативність Овна, а Овен захоплюється шляхетністю Лева. У парі панує атмосфера гри і романтики, хоча інколи двом гордим натурам доводиться ділити увагу та визнання. За умови взаємної підтримки і похвали ця пара здатна на довготривале щасливе кохання, адже їхні серця горять однаково яскравим вогнем.');
INSERT INTO public.zodiac_compatibility VALUES (29, 3, 8, 45, 'Овен і Діва – незвична пара, де імпульсивність вогню стикається з розважливістю землі. Рішучий Овен діє перш ніж подумати, а практична Діва все ретельно аналізує – ці різні підходи спочатку можуть викликати іскри нерозуміння. Проте Овен захоплюється мудрістю і надійністю Діви, а Діва у глибині душі милується сміливістю та життєлюбством партнера-Овна. Щоб досягти гармонії, їм слід навчитися поважати відмінності: Овен може внести у життя Діви більше радості і спонтанності, а Діва допоможе Овну стати трохи організованішим. Якщо вони будуть терпеливі й уважні одне до одного, то зможуть перетворити свої протилежності на доповнення і побудувати ніжні, хоч і трохи ексцентричні стосунки.');
INSERT INTO public.zodiac_compatibility VALUES (30, 3, 9, 65, 'Овен і Терези – пара протилежностей, що притягуються на рівні стихій Вогню і Повітря. Запальному Овну імпонує чарівність та дипломатичність Терезів, тоді як романтичні Терези захоплюються сміливістю та щирістю Овна. Між ними часто виникає сильний фізичний і емоційний потяг: ці двоє здатні доповнювати одне одного, поєднуючи пристрасть з гармонією. Конфлікти можливі, коли Овен наполегливо відстоює свою думку, а Терези уникають сварок – їм потрібно навчитися відкрито обговорювати проблеми, не втрачаючи поваги. За умови компромісу ця пара може бути щасливою: Овен принесе у їхнє життя вогонь кохання, а Терези подарують стосункам рівновагу, красу і взаємну підтримку.');
INSERT INTO public.zodiac_compatibility VALUES (31, 3, 10, 50, 'Овен і Скорпіон утворюють вибухове поєднання двох сильних характерів, де вогонь зустрічається з водою. Обидва знаки пристрасні і волелюбні: Овен діє відкрито і прямо, тоді як загадковий Скорпіон глибоко переживає емоції і часто діє інтуїтивно. Їхній роман може початися з шаленої пристрасті – сексуальне тяжіння між цими знаками надзвичайно сильне і магнетичне. Проте у повсякденності можливі зіткнення характерів: ревнивий Скорпіон часом ображається на прямоту Овна, а незалежний Овен не терпить спроб контролю з боку партнера. Якщо вони навчаться довіряти і стримувати свій запал під час конфліктів, то можуть створити глибокий і відданий союз, побудований на пристрасті та взаємному захопленні.');
INSERT INTO public.zodiac_compatibility VALUES (32, 3, 11, 90, 'Овен і Стрілець – дві споріднені душі стихії Вогню, їхній союз майже ідеальний за захопливістю та взаєморозумінням. Обидва знаки оптимістичні, енергійні та люблять пригоди: разом вони почуваються вільно і радісно, немов двоє відчайдушних мандрівників по життю. Стрілець захоплюється лідерським духом Овна, а Овен цінує життєрадісність та мудрий гумор Стрільця – в їхніх стосунках панує взаємна підтримка та ентузіазм. Ця пара рідко нудьгує: вони постійно відкривають нові горизонти, діляться мріями і надихають один одного на сміливі кроки. Навіть конфлікти між ними швидко згасають, бо обидва не тримають зла – їх об’єднує щире тепло і пристрасть, які роблять цей союз міцним та щасливим.');
INSERT INTO public.zodiac_compatibility VALUES (33, 3, 12, 40, 'Овен і Козеріг – непростий дует, у якому імпульсивний вогонь зустрічається з холодкуватою мудрістю землі. Амбітний Козеріг цінує порядок, дисципліну і прагне довгострокових цілей, тоді як вольовий Овен живе сьогоденням і прагне миттєвих перемог. Спочатку їх може взаємно зацікавити сила характерів одне одного – Козерога інтригує сміливість Овна, а Овна приваблює загадкова витримка Козерога. Проте у стосунках виникають труднощі: Овен може відчувати, що обережний партнер стримує його пориви, а Козеріг часом критикує Овна за недбалість і поспішність. Якщо вони навчаться об’єднувати зусилля – Овен внесе у життя пари драйв і натхнення, а Козеріг забезпечить стабільність – їхній союз може поступово зміцніти і перерости у взаємоповагу.');
INSERT INTO public.zodiac_compatibility VALUES (34, 4, 4, 90, 'Двоє Тельців утворюють гармонійну і стабільну пару, адже вони обидва – земні знаки, що цінують комфорт, вірність і затишок. Їхні стосунки розвиваються повільно і ніжно: кожен партнер розуміє потребу іншого в безпеці та постійності, тому вони почуваються поруч як удома. У такій парі багато чуттєвості та турботи – Тельці щиро піклуються один про одного, насолоджуючись простими радощами життя: смачною вечерею, теплими обіймами, спільними традиціями. Конфлікти між ними рідкісні, хоча впертість обох може проявлятися: якщо виникають суперечки, то іноді важко визначити, хто поступиться першим. На щастя, глибока прив’язаність і прагнення миру допомагають їм долати негаразди – два Тельці здатні прожити разом довге щасливе життя, засноване на любові, довірі та взаємній повазі.');
INSERT INTO public.zodiac_compatibility VALUES (35, 4, 5, 20, 'Телець і Близнюки – дуже різні натури, і їхній союз вважається досить складним через протилежний ритм життя і погляди. Практичний, врівноважений Телець любить спокій і передбачуваність, тоді як легкі на підйом Близнюки мінливі, допитливі і постійно шукають нових вражень. Спочатку Тельця може привабити блискучий розум та дотепність Близнюків, а ті, у свою чергу, оцінять доброту і надійність партнера-Тельця. Але згодом Близнюкам може стати нудно з надто розміреним Тельцем, а Тельця дратуватиме непослідовність та непосидючість Близнюків – вони ніби живуть в різних швидкостях. Цій парі важко знайти спільний ритм, проте якщо обидва щиро закохані і готові до компромісів, Телець принесе стабільність, а Близнюки – яскравість, що може врівноважити їхні стосунки.');
INSERT INTO public.zodiac_compatibility VALUES (36, 4, 6, 96, 'Телець і Рак створюють ніжну та гармонійну пару, де земля і вода природно доповнюють одне одного. Обидва цінують дім, сім’ю та щирі почуття: турботливий Рак відчуває себе захищеним поруч з сильним і спокійним Тельцем, а Телець знаходить в партнері-Раку розуміння і емоційне тепло. Їхній роман розквітає поступово – від вірної дружби до глибокого кохання, збудованого на довірі та взаємній підтримці. Вони інтуїтивно розуміють потреби одне одного: Рак оточує Тельця ласкою і увагою, а практичний Телець забезпечує Раку стабільність та відчуття безпеки. Ця пара має всі шанси на довге і щасливе життя разом – їхній союз міцний, затишний і благословенний справжнім взаємним коханням.');
INSERT INTO public.zodiac_compatibility VALUES (37, 4, 7, 35, 'Телець і Лев – союз землі і вогню, який може бути непростим через різні пріоритети і темпераменти партнерів. Розкішний і гордий Лев любить яскраве життя та увагу, тоді як спокійний Телець прагне простоти, стабільності та душевного комфорту. Спочатку вони можуть захопитися один одним: Лева вражає надійність і сила Тельця, а Телець у захваті від щедрості та харизми Лева. З часом розбіжності стають помітними – Леву може бракувати динаміки і захоплення, а Тельця втомлює потреба Лева бути в центрі уваги та його іноді драматична натура. Якщо кожен навчиться цінувати особливості іншого – Лев подарує стосункам пристрасть і масштаб, а Телець забезпечить їм надійний тил – ця пара матиме шанс знайти власний баланс у коханні.');
INSERT INTO public.zodiac_compatibility VALUES (38, 4, 8, 85, 'Телець і Діва – чудово сумісний земний дует, який вирізняється спільними цінностями, розумінням і прагненням до стабільності. Практична Діва захоплюється силою і вірністю Тельця, а Телець цінує розум, турботливість і уважність Діви до дрібниць. Їхні стосунки розвиваються надійно і спокійно: партнери відчувають себе впевнено один з одним, вміють домовлятися про побутові речі і підтримують спільні життєві плани. У цій парі багато щирої поваги і допомоги: Діва охоче ділиться порадами і лагідно піклується про Тельця, а Телець створює для Діви атмосферу захищеності і любові. Разом вони утворюють міцний союз двох дорослих душ: їхнє кохання з роками стає тільки сильнішим, адже ґрунтується на дружбі, довірі і повній відданості одне одному.');
INSERT INTO public.zodiac_compatibility VALUES (39, 4, 9, 30, 'Телець і Терези – поєднання землі та повітря, яке сповнене як взаємного тяжіння, так і викликів. Обома знаками керує планета Венера, тому спочатку між ними виникає сильна романтика: елегантні Терези зачаровують Тельця своєю ніжністю і шармом, а Терези захоплюються чуттєвістю і надійністю Тельця. Вони люблять красу і комфорт, тому можуть насолоджуватися спільними тихими вечорами при свічках і гарною музикою – їх притягують естетика і гармонія. Проте різниця в характері дається взнаки: Терези більш легкі і соціальні, а Телець прагне усамітнення і сталості – це може спричиняти непорозуміння, коли Терези хочуть нових вражень, а Телець воліє звичного затишку. Щоб цей союз був вдалим, партнерам слід йти на зустріч: якщо Телець проявить більше гнучкості, а Терези – більше вірності, то їхні стосунки зможуть поєднати найкращі якості обох і перетворитися на щасливе кохання.');
INSERT INTO public.zodiac_compatibility VALUES (40, 4, 10, 65, 'Телець + Скорпіон – магнетична пара протилежностей, яка має потужне взаємне притягання. Стабільний земний Телець і емоційно глибокий водний Скорпіон знаходять один в одному те, чого їм бракує: Скорпіона заворожує сила і спокій Тельця, а Телець зачарований загадковою пристрастю Скорпіона. Між ними часто спалахує неймовірно сильна фізична і душевна близькість – їхній інтимний зв’язок насичений емоціями і чуттєвістю. Проте ці двоє – дуже вперті знаки, і конфлікти можуть бути бурхливими: власницький Скорпіон часом провокує ревнощі, а непохитний Телець не любить підкорятися чужому контролю. Якщо вони навчаться довіряти і прощати, їхній союз може стати одним з найміцніших: поєднання вірності Тельця і відданості Скорпіона створює глибоке, трансформуюче кохання на все життя.');
INSERT INTO public.zodiac_compatibility VALUES (41, 4, 11, 25, 'Телець і Стрілець – непроста комбінація, де спокійна земля стикається з непосидючим вогнем. Безтурботний, свободолюбний Стрілець цінує зміну вражень і простір, тоді як домашній Телець прагне затишної стабільності та передбачуваності. Спершу їх може поєднати цікавість одне до одного: Тельця зачаровує життєрадісність Стрільця, а Стрілець знаходить у Тельці ніжність та надійне плече. Але з часом відмінності стають очевидними – Стрільця дратує, що Телець буває надто повільним і не готовим до авантюр, а Телець переживає через непосидючість і відсутність постійності у Стрільці. Цим двом потрібне багато терпіння: якщо Стрілець навчиться бути більш уважним і вірним, а Телець дасть партнеру трохи більше свободи, їхні стосунки можуть набути приємної рівноваги між пригодами і надійністю.');
INSERT INTO public.zodiac_compatibility VALUES (42, 4, 12, 95, 'Телець і Козеріг – союз двох родинних стихій землі, що славиться своєю надійністю і довговічністю. Обидва знаки практичні, відповідальні і серйозно ставляться до стосунків: Козеріг захоплюється щирістю та відданістю Тельця, а Телець поважає амбітність і мудрість Козерога. Їхня любов розвивається неквапливо, зате впевнено – з кожним днем вони все більше довіряють одне одному і спільно будують міцний фундамент для майбутнього. У повсякденному житті вони дивовижно злагоджені: партнери підтримують одне одного в роботі і побуті, вміють разом планувати фінанси, дім і родину, не втрачаючи при цьому романтики у серці. Цей союз майже безхмарний: поєднання ніжності Тельця і дисциплінованості Козерога дає парі силу пройти через будь-які випробування та зберегти глибоке, спокійне і вірне кохання на все життя.');
INSERT INTO public.zodiac_compatibility VALUES (43, 5, 5, 85, 'Двоє Близнюків – це пара двох споріднених повітряних душ, яким ніколи не буває нудно разом. Обидва партнери товариські, дотепні та легкі на підйом, тож їхній роман схожий на веселу гру – сповнений сміху, цікавих розмов і спонтанних пригод. Вони чудово розуміють змінність настроїв одне одного і не ображаються на невеликі примхи, адже самі такі ж – це додає стосункам свободи та взаємного прийняття. Єдина складність – обом іноді бракує стабільності: двоє непосид можуть відволікатися на зовнішній світ і не приділяти достатньо уваги поглибленню емоційного зв’язку. Проте, якщо вони щиро кохають, то, використовуючи свій блискучий інтелект і гумор, здатні вирішити будь-які проблеми – їхній союз залишатиметься живим, романтичним і міцним на основі дружби.');
INSERT INTO public.zodiac_compatibility VALUES (44, 5, 6, 15, 'Близнюки і Рак – дуже різна пара, де легкість повітря зустрічається з глибиною води. Веселі, мінливі Близнюки живуть розумом і новими ідеями, тоді як чутливий Рак керується серцем і емоціями – їм важко говорити однією мовою почуттів. На початку Рак може бути зачарований харизмою та гострим розумом Близнюків, а ті – приваблені ніжністю і добротою Рака. Та з часом Раку не вистачає емоційної віддачі від більш поверхових Близнюків: він може відчувати себе непочутим або покинутим, у той час як Близнюкам складно мати справу з глибокими переживаннями Рака, яких вони не розуміють. Цей союз вимагатиме багато терпіння і зусиль: якщо Близнюки навчаться проявляти більше чуйності, а Рак – давати більше свободи, то вони зможуть створити крихкий, але зворушливо теплий зв’язок.');
INSERT INTO public.zodiac_compatibility VALUES (45, 5, 7, 85, 'Близнюки і Лев – яскрава і соціальна пара, що легко стає центром уваги завдяки своїй привабливості та веселому настрою. Комунікабельні Близнюки зачаровують Лева своєю дотепністю і винахідливістю, а шляхетний Лев щедро дарує партнерам-Близнюкам тепло, захист і захоплення. Їхні стосунки повні пригод та світських подій: вони разом відвідують вечірки, подорожують, творять спільні проекти – їм подобається активне, насичене життя одне з одним. Іноді Лев може вимагати більше уваги і поклоніння, ніж легковажні Близнюки здатні постійно давати, а Близнюкам часом важко прийняти впертий характер Лева. Однак взаємний оптимізм і щирі почуття перемагають: підтримуючи его Лева компліментами та цінуючи свободу Близнюків, ця пара здатна збудувати дуже щасливий, блискучий союз, де завжди панує сміх і любов.');
INSERT INTO public.zodiac_compatibility VALUES (46, 5, 8, 30, 'Близнюки і Діва – обидва під керуванням Меркурія, планети інтелекту, але їхні характери та підходи до життя різняться. Кмітливі Близнюки прагнуть різноманіття і легко переключаються з теми на тему, тоді як аналітична Діва більше зосереджена на деталях, порядку і доведенні справ до кінця. Спочатку їх може поєднати інтелектуальний діалог: Діву захоплює ерудиція та творчість Близнюків, а Близнюки цінують мудрі поради та практичність Діви. Але емоційно їм непросто – Діва критично ставиться до хаотичності Близнюків, а ті можуть нудьгувати від прагнення Діви все контролювати і розкладати по поличках. Цим двом варто навчитися терпіння: якщо Близнюки проявлять більше відповідальності, а Діва – більше гнучкості, вони зможуть взаємно збагатити одне одного і створити цікаві, хоч і трохи ексцентричні стосунки.');
INSERT INTO public.zodiac_compatibility VALUES (47, 5, 9, 75, 'Близнюки і Терези – повітряний дует, що славиться чудовою інтелектуальною та емоційною сумісністю. Обидва знаки товариські, романтичні і цінують гармонію: вони відразу знаходять багато спільних тем для розмов та інтересів, їх притягує взаємна легкість і чарівність. У стосунках панує атмосфера елегантності та взаєморозуміння – Терези приносять баланс і ніжність, а Близнюки – гумор та свіжість, завдяки чому їхній роман розвивається плавно і радісно. Іноді рішення можуть даватися важко, адже обидва трохи непостійні: Терези довго зважують «за» і «проти», а Близнюки можуть передумати в останній момент – це дрібні негаразди, які вони сприймають з усмішкою. Загалом ця пара дуже щаслива: вони є одне для одного і друзями, і коханцями, легко прощають недоліки і насолоджуються легким, ніжним і інтелектуально стимулюючим коханням.');
INSERT INTO public.zodiac_compatibility VALUES (48, 5, 10, 10, 'Близнюки і Скорпіон – складний союз легковажності і глибини, де веселий вітер зустрічає незворушні води таємниць. Поверхневим Близнюкам важко збагнути пристрасну і потаємну душу Скорпіона, а той, у свою чергу, може не довіряти мінливому характеру партнерів-Близнюків. Спершу Скорпіона може зацікавити гострий розум і соціальність Близнюків, а Близнюки, можливо, відчують потяг до магнетизму і сили Скорпіона. Проте з часом їхні відмінності призводять до непорозумінь: Скорпіон прагне глибокої емоційної близькості та вірності, а Близнюки, які люблять свободу і спілкування з багатьма людьми, можуть не виправдати його очікувань. Цей союз рідко буває тривалим без великих зусиль, але якщо доля зводить їх, то лише через взаємне навчання – Скорпіон вчить Близнюків глибини почуттів, а Близнюки нагадують Скорпіону про важливість легкості та сміху.');
INSERT INTO public.zodiac_compatibility VALUES (49, 5, 11, 99, 'Близнюки і Стрілець – протилежні знаки на колі Зодіаку, які утворюють надзвичайно вдалу і яскраву пару. Їх об’єднує любов до свободи, знань і нових вражень: обидва оптимістичні, допитливі і легко збуджуються ідеєю спільної пригоди. Вони відразу стають друзями і коханцями водночас – безкінечні розмови, сміх, подорожі і взаємне підштовхування до розвитку роблять їхній союз динамічним та щасливим. Між ними панує глибока довіра: Стрілець цінує чесність і кмітливість Близнюків, а ті – мудрість і щирість Стрільця; сварки якщо і виникають, то швидко забуваються. Ця пара справляє враження створеної на небесах – їхнє кохання яскраве, взаємно надихаюче та сповнене пригод, і може тривати все життя, не втрачаючи свого вогню.');
INSERT INTO public.zodiac_compatibility VALUES (50, 5, 12, 10, 'Близнюки і Козеріг – комбінація повітря і землі, яка часто здається несумісною через різний підхід до життя. Легкі на підйом, непосидючі Близнюки цінують спілкування та новизну, у той час як серйозний Козеріг орієнтований на роботу, цілі і стабільність – їхні життєві цінності частково різняться. Спочатку Козерога може зацікавити яскравість і дотепність Близнюків, а ті, у свою чергу, відзначать внутрішню силу та амбіційність Козерога. Однак у стосунках їм непросто: Козеріг вважає Близнюків ненадійними і легковажними, а Близнюкам Козеріг здається надто суворим і консервативним – їм важко повністю зрозуміти потреби одне одного. Цей союз потребує багато компромісів та роботи над собою – якщо Близнюки навчаться більшої відповідальності, а Козеріг трохи розслабиться і прийме веселу натуру партнера, то між ними може виникнути повага і навіть особливий зв’язок, хоча й нетиповий.');
INSERT INTO public.zodiac_compatibility VALUES (51, 6, 6, 90, 'Двоє Раків – це глибоко емоційна і ніжна пара, яка розуміє одне одного з півслова і півподиху. Обидва – водні знаки, чутливі, співчутливі та схильні до турботи, тому їхні стосунки наповнені теплом, увагою та взаємною підтримкою. Вони створюють затишний спільний світ: раді разом проводити вечори вдома, дбати про родину, обмінюватися найпотаємнішими почуттями, знаючи, що партнер завжди вислухає і зрозуміє. Конфлікти між ними рідкісні і зазвичай пов’язані лише з тим, що кожен може надто глибоко брати близько до серця слова іншого – проте вони швидко миряться, адже не вміють довго ображатися на кохану людину. Цей союз дуже гармонійний: двоє Раків разом відчувають себе у безпеці і коханні, їхня душевна спорідненість робить їхнє подружнє життя щасливим і міцним на довгі роки.');
INSERT INTO public.zodiac_compatibility VALUES (52, 6, 7, 25, 'Рак і Лев – непроста комбінація води і вогню, де тихі глибини чутливості стикаються з палким темпераментом. Ніжний, сором’язливий Рак прагне емоційної близькості і затишку, тоді як гордий Лев жадає яскравих вражень, похвали і бути в центрі уваги. Спершу Лева може привабити зворушлива щирість та ніжність Рака, а Рак захопиться впевненістю і блиском Лева – між ними виникає своєрідне тяжіння протилежностей. Проте Раку може бути боляче від прямолінійності та домінантності Лева, а Леву – важко зрозуміти змінний настрій і образливість Рака, через що виникають часті образи. Цій парі складно досягти гармонії, але якщо вони дуже кохають: Лев навчиться бути делікатнішим, а Рак – більш впевненим, тоді їхній зв’язок може стати теплішим, поєднавши щирість Рака із великодушністю Лева.');
INSERT INTO public.zodiac_compatibility VALUES (53, 6, 8, 80, 'Рак і Діва – сприятлива комбінація води і землі, де практичність і відданість Діви доповнює чутливість і турботливість Рака. Діва захоплюється глибиною душі і інтуїцією Рака, а Рак цінує надійність, мудрість і увагу до дрібниць з боку партнера-Діви. Їхні стосунки базуються на довірі і повазі: Діва допомагає Раку відчути себе захищеним в реальному світі, підтримує його у повсякденних справах та захищає від життєвих негараздів, а Рак наповнює життя Діви емоційним змістом, теплом і натхненням. У парі мало конфліктів – і Рак, і Діва прагнуть уникати сварок, краще обговорити проблему спокійно за чашкою чаю; хіба що іноді надмірна критичність Діви може зачепити вразливого Рака. Загалом цей союз дуже комфортний: Рак і Діва стають не тільки закоханими, а й найкращими друзями, які завжди готові підставити одне одному плече та разом створити щасливу родину.');
INSERT INTO public.zodiac_compatibility VALUES (54, 6, 9, 25, 'Рак і Терези – витончений, але дещо крихкий союз, де емоційна вода намагається знайти порозуміння з інтелектуальним повітрям. Романтичні Терези захоплюються добрим серцем і ніжністю Рака, а Рак приваблений чарівністю, м’якістю та справедливістю Терезів. Спочатку між ними виникає взаємна симпатія: Терези приносять у життя Рака гармонію і спокій, вміють заспокоїти його тривоги, а Рак дарує Терезам щиру любов і відданість, якої ті прагнуть. Проте в довгостроковій перспективі можуть з’явитися проблеми: Раку важко переживати нерішучість Терезів та їх прагнення розподілити увагу і між іншими людьми, а Терези іноді втомлюються від емоційних хвиль Рака і його ревнощів. Ця пара потребує делікатності та рівноваги: якщо Терези навчаться бути більш чуйними до почуттів Рака, а Рак – більш довіряти і не тиснути на партнера, їхнє ніжне кохання має шанс перетворитися на гармонійний довготривалий союз.');
INSERT INTO public.zodiac_compatibility VALUES (55, 6, 10, 79, 'Рак і Скорпіон – глибокий, майже містичний союз двох водних знаків, які відчувають одне одного на інтуїтивному рівні. Обидва партнери емоційні і щирі: сором’язливий Рак знайде у пристрасному Скорпіоні сильного захисника, якому можна довіритися, а Скорпіон цінує відданість, ніжність і розуміння з боку Рака. Між ними виникає потужний емоційний та фізичний зв’язок – вони діляться найпотаємнішими таємницями, глибоко співпереживають одне одному і відчувають неймовірну близькість у коханні. Інколи ревнощі Скорпіона чи перепади настрою Рака можуть призводити до сварок, проте ці двоє настільки прив’язані, що здатні швидко пробачати і ще міцніше притулятися одне до одного після конфліктів. Їхнє кохання інтенсивне, вірне і трансформуюче: Рак і Скорпіон здатні разом пройти крізь будь-які випробування, підтримуючи і безмежно люблячи одне одного на глибинному, душевному рівні.');
INSERT INTO public.zodiac_compatibility VALUES (56, 6, 11, 30, 'Рак і Стрілець – непростий дует, у якому домашній затишок Рака стикається з бунтівною жагою пригод Стрільця. Чутливому Раку потрібна стабільність, відчуття, що його кохають і про нього дбають, тоді як волелюбний Стрілець прагне простору, нових горизонтів, відкритого світу без обмежень. Спершу їх може зацікавити і навіть зачарувати відмінність характерів: Рак захопиться оптимізмом і життєлюбством Стрільця, а Стрілець зворушиться ніжністю і романтизмом Рака. Але надалі проблем не уникнути: Рак відчуває себе нестабільно поруч з непосидючим партнером, страждає від браку уваги, а Стрілець може задихатися від надмірної чутливості та потреби Рака в постійній близькості. Цим двом важко бути разом, проте якщо доля зведе їх у коханні, то їм необхідно багато спілкуватися і шукати компроміси – можливо, тоді вогонь Стрільця зможе лагідно зігріти ніжне серце Рака, не обпаливши його.');
INSERT INTO public.zodiac_compatibility VALUES (57, 6, 12, 85, 'Рак і Козеріг – пара полярних знаків (вода і земля), що лежать один навпроти одного на зодіакальному колі, і саме тому можуть ідеально збалансувати одне одного. Сором’язливий, сімейний Рак та амбітний, стриманий Козеріг спочатку здаються несхожими, але кожен має те, чого бракує іншому: Козеріг дає Раку відчуття захищеності та структури, а Рак вчить Козерога виражати емоції і відчувати тепло близькості. Їхні стосунки розвиваються поступово і серйозно – обидва налаштовані на довготривалий союз, тому готові працювати над взаєморозумінням і підтримувати одне одного у всьому. Козеріг захоплюється глибиною любові і вірністю Рака, тоді як Рак поважає мудрість, надійність і працелюбність партнера-Козерога – разом вони створюють міцну команду, яка долає життєві труднощі пліч-о-пліч. Ця пара має великий потенціал для щастя: поєднання відданого серця Рака і незламної підтримки Козерога народжує глибоке, зріле кохання, яке лише зміцнюється з роками.');
INSERT INTO public.zodiac_compatibility VALUES (58, 7, 7, 75, 'Двоє Левів – королівський союз, у якому сходяться дві яскраві, горді особистості стихії Вогню. Їхні стосунки сповнені пристрасті, розкоші та взаємного захоплення: кожен Лев бачить в партнері власне віддзеркалення – сильного, чарівного та щедрого. Вони разом створюють атмосферу свята – люблять красиво проводити час, дарувати один одному дорогі подарунки та компліменти, пишаються своєю парою перед оточуючими. Конфлікти можуть виникати, коли обидва одночасно прагнуть бути лідерами і отримувати максимум уваги: двом царям на одному троні буває тісно, тож їм доведеться навчитися ділитися славою і йти на поступки по черзі. Якщо Леви зуміють приборкати своє его і щиро радіти успіхам одне одного, їхнє кохання буде блискучим і міцним – союз двох великих сердець, що горять унісон.');
INSERT INTO public.zodiac_compatibility VALUES (59, 7, 8, 30, 'Лев і Діва – незвичний дует сусідніх знаків, у якому сяючий вогонь зустрічає стриману землю. Величний, темпераментний Лев прагне визнання і поваги, тоді як скромна і розсудлива Діва зазвичай воліє залишатися в тіні, спостерігаючи за всім критичним поглядом. Спочатку Лева може привабити мудрість і надійність Діви, а Діву – благородство, щедрість і сила Лева; вони допитливо вивчають одне одного, ніби протилежності, що притягуються. Але з часом Леву бракує емоційної віддачі та захоплення від стриманої Діви, а Діву можуть втомлювати драматичність і потреба Лева в постійних похвалах – Діва не розуміє цих «вистав» і може несвідомо критикувати, чим ранить Лева. Для успіху цієї пари потрібно багато толерантності: якщо Лев навчиться цінувати тиху підтримку Діви, а Діва – частіше хвалити і захоплюватися партнером, то їхні різні світи зможуть доповнити одне одного і перетворитися на стабільне, взаємовигідне кохання.');
INSERT INTO public.zodiac_compatibility VALUES (60, 7, 9, 80, 'Лев і Терези – одна з найкрасивіших і найгармонійніших пар зодіаку, де вогонь та повітря створюють атмосферу любові та елегантності. Галантні Терези з самого початку зачаровані харизмою, відвагою та теплотою Лева, а Лев, у свою чергу, не може не захоплюватися витонченістю, дипломатичністю та романтичною вдачею Терезів. Їхній роман розвивається легко і щасливо: Лев щедро дарує любов та подарунки, оберігає партнера, а Терези оточують Лева увагою, ніжністю та розумінням – обоє почуваються коханими і особливими. Інколи Лев може проявляти авторитарність, але м’які Терези вміють згладжувати гострі кути своїм тактом; водночас Лев допомагає нерішучим Терезам зробити вибір і відчувати себе впевненіше. Разом вони утворюють майже ідеальну пару: їхнє кохання пристрасне і водночас гармонійне, сповнене романтики, краси та взаємної поваги, завдяки чому цей союз має всі шанси на довге щасливе життя.');
INSERT INTO public.zodiac_compatibility VALUES (61, 7, 10, 25, 'Лев і Скорпіон – дуже інтенсивна та вибухова комбінація вогню і води, яка рідко буває простою. Обидва знаки надзвичайно сильні, вольові і ревниві: гордий Лев вимагає обожнювання і не терпить конкуренції, а глибокий Скорпіон потребує повного єднання душ і контролю над ситуацією. Між ними з першого погляду часто виникає магнетичний потяг – пристрасть у цій парі палає яскраво, їх сексуальна енергія дуже потужна, що може надовго прив’язати їх одне до одного. Проте їхні зіткнення можуть бути драматичними: Скорпіон критикує і ревнує, не бажаючи підкорятися царственій природі Лева, а Лев обурюється на «темні» ігри Скорпіона та його спроби маніпулювати. Цей союз – справжня битва характерів, де кохання і ненависть ходять поруч; лише глибоке почуття і взаємна повага до сили одне одного здатні втримати Лева і Скорпіона разом, перетворивши їхній бурхливий зв’язок на глибоке, пристрасне кохання з елементами драми.');
INSERT INTO public.zodiac_compatibility VALUES (62, 7, 11, 80, 'Лев і Стрілець – блискуча вогняна пара, де обидва партнери діляться однією стихією, що гарантує їм чудове розуміння і спільний запал. Оптимістичний, авантюрний Стрілець і шляхетний, енергійний Лев миттєво знаходять спільну мову: вони обидва люблять життя, веселощі та великі мрії, тож їхні побачення завжди перетворюються на свято. Стрілець щиро захоплюється великодушністю і харизмою Лева, а Лев цінує мудрість, прямоту і почуття гумору Стрільця – вони взаємно підживлюють амбіції та творчість одне одного. У стосунках панує свобода і довіра: кожен з них зберігає свою незалежність, але залишається відданим партнеру; вони рідко ревнують чи обмежують одне одного, адже кохання для них – це спільний політ, а не клітка. Ця пара має всі шанси прожити разом яскраве і щасливе життя: їх об’єднує пристрасть, дружба і спільний світогляд, тож навіть з роками вогонь їхнього кохання не згасає, а лише тепліше горить.');
INSERT INTO public.zodiac_compatibility VALUES (63, 7, 12, 25, 'Лев і Козеріг – незвична пара, де сяйво сонячного Лева перетинається з тінню серйозного Козерога. Життєрадісний, щедрий Лев звик бути в центрі уваги і витрачати життя, насолоджуючись кожною миттю, тоді як стриманий, працьовитий Козеріг зосереджений на цілях, роботі і відповідальності. Спочатку Леву імпонує надійність і зрілість Козерога – поруч із ним він почувається захищеним і шанованим, а Козерога приваблюють блискуча харизма, щедрість і життєлюбність Лева – той відкриває йому світ радості і сміливості. Але з часом Лев може відчувати брак емоційного тепла та підтримки від стриманого Козерога, а Козеріг буде невдоволений «легковажністю» Лева – фінансовою чи побутовою непрактичністю, прагненням постійних розваг. Цей союз вимагає багато роботи: якщо Лев навчиться більшої дисципліни та терпіння, а Козеріг – буде частіше хвалити Лева і розділяти його радість, то вони зможуть створити шанобливі стосунки, де серйозність Козерога врівноважить сонячне тепло Лева.');
INSERT INTO public.zodiac_compatibility VALUES (64, 8, 8, 70, 'Двоє Дів утворюють практичний і гармонійний союз, де обидва партнери дивляться на світ через призму логіки, порядку та відповідальності. Вони чудово розуміють одне одного: у стосунках панує порядок і взаємна підтримка – кожен намагається допомогти іншому порадою, впорядкувати спільний побут і разом вирішувати проблеми. Ця пара може здаватися дещо стриманою назовні, але їх об’єднує глибока повага і довіра: вони віддані і щирі, цінують вірність та стабільність, які разом будують день за днем. Можливий мінус – обидва схильні до критичності: іноді вони надто прискіпливо ставляться одне до одного через дрібниці, що може викликати невеликі образи. Проте, якщо Діви навчаться трохи більше хвалити і підтримувати одне одного замість критики, їхнє спільне життя буде спокійним, надійним та щасливим – союз двох розумних, добрих серцем людей.');
INSERT INTO public.zodiac_compatibility VALUES (65, 8, 9, 40, 'Діва і Терези – цікавий союз сусідніх знаків, де практична земля межує з повітряною легкістю, породжуючи як взаємне тяжіння, так і нерозуміння. Розсудлива Діва захоплюється шармом, витонченістю та доброзичливістю Терезів, а Терези цінують інтелект, надійність і почуття обов’язку Діви – на початку вони знаходять багато спільного через спокійний темперамент. У їхніх стосунках є взаємна повага та ввічливість: Діва допомагає Терезам більш організовано підходити до справ, а Терези вчать Діву відпочивати і насолоджуватися прекрасним. Але вони по-різному приймають рішення: Діва аналітична і критична, а Терези довго вагаються, прагнучи гармонії – це може дратувати Діву, а Терези можуть відчувати себе трошки «під контролем» у перфекціоністської Діви. За бажання ці знаки здатні знайти баланс: якщо Діва буде менш категоричною, а Терези – більш відповідальними, їхні різні підходи доповнять одне одного, подарувавши стосункам і стабільність, і романтичну іскру.');
INSERT INTO public.zodiac_compatibility VALUES (66, 8, 10, 95, 'Діва і Скорпіон – одна з найсильніших і найцікавіших комбінацій землі та води, де раціональність поєднується з глибиною почуттів. Обидва партнери серйозні, віддані та уважні до деталей: Діва вражена пристрастю та рішучістю Скорпіона, а Скорпіон поважає мудрість, надійність та аналітичний розум Діви. Їхнє кохання розквітає поступово, але вкорінюється глибоко – вони стають справжньою командою, що підтримує одне одного у всіх сферах життя, зберігаючи при цьому романтичну іскру. Діва привносить у стосунки стабільність і спокій, вміє заспокоїти емоційні бурі Скорпіона логікою і турботою, а Скорпіон додає пристрасті та емоційної насиченості, пробуджуючи у стриманій Діві глибші почуття. Цей союз майже бездоганний: об’єднавши свої найкращі якості – відданість, чесність та чуттєвість – Діва і Скорпіон здатні прожити довге і щасливе життя, будучи одне одному і партнерами, і опорою, і справжніми спорідненими душами.');
INSERT INTO public.zodiac_compatibility VALUES (67, 8, 11, 25, 'Діва і Стрілець – доволі непростий союз, де обережна практичність стикається з бурхливим оптимізмом і жагою пригод. Діва живе за планом, уважна до дрібниць та зобов’язань, натомість Стрілець спонтанний, волелюбний і не любить обмежень – це може викликати взаємне нерозуміння. Спочатку Стрільця приваблює витонченість і розум Діви, а Діву інтригує життєрадісність і прямота Стрільця – між ними пробігає іскра цікавості і навіть флірту. Проте будувати щось серйозне важко: Діву дратує безтурботність Стрільця і його нехтування деталями, а Стрілець почувається скуто під постійною критикою та строгістю Діви. Ця пара вимагає величезної роботи над собою: якщо вони спробують перейняти кращі риси одне одного – Стрілець стане трохи відповідальнішим, а Діва навчиться легше ставитися до життя – тоді з’явиться надія на нестандартне, але цікаве партнерство.');
INSERT INTO public.zodiac_compatibility VALUES (68, 8, 12, 80, 'Діва і Козеріг – чудово сумісний земний союз, що грунтується на спільних цінностях, працьовитості та взаємній повазі. Обидва прагнуть стабільності, успіху та порядку в житті: старанна Діва захоплюється амбітністю і витримкою Козерога, а Козеріг цінує уважність, інтелект та відданість Діви. У стосунках вони з самого початку серйозні і щирі – можуть разом працювати над спільними цілями, підтримувати одне одного в кар’єрі і створювати міцний фундамент для сім’ї. Діва приносить у життя пари затишок, турботу про дрібниці та здоровий глузд, а Козеріг додає структур, стабільності і певності у майбутньому, чого часом бракує Скорпіону ).');
INSERT INTO public.zodiac_compatibility VALUES (69, 9, 9, 70, 'Знак Терезів є знаком стосунків, і вони часто мають місію навчати інших, як будувати взаємини. Коли двоє Терезів починають зустрічатися, їм може бути важко знайти мету своїх стосунків, оскільки вони обоє, здається, мають спільну місію та мету, пов''язану з іншими людьми. Якщо вони знайдуть спільну точку дотику, поєднавши свої дії та дотримуючись спільних цінностей, вони матимуть тенденцію стати ідеально збалансованою парою. Єдине, чого їм обом бракує і що дуже важко розвинути, — це почуття взаємної поваги без пасивного осуду чи очікувань. Обоє схильні до цієї проблеми у своєму оточенні, і коли вони разом, ці проблеми легко множаться. Якщо вони дозволять одне одному бути такими, якими вони є, вони можуть стати натхненням для всіх нас, навчаючи нас, що таке справді продуктивні стосунки.');
INSERT INTO public.zodiac_compatibility VALUES (70, 9, 10, 30, 'Стосунки між Терезами та Скорпіоном аж ніяк не є легкими та безтурботними. Обом партнерам доведеться зіткнутися зі своїми темними сторонами через цей зв''язок, і хоча це може призвести до неймовірного та інтенсивного сексуального життя та емоцій, які ніхто інший не може зрозуміти, це може привести їх обох до депресивної ями, з якої вони не зможуть легко вибратися. Єдиний спосіб для цієї пари зберегти задоволення і ніжні стосунки — це побудувати сильне індивідуальне, незалежне життя, інакше вони потраплять у вир кармічних емоцій і нав''язливих, негативних очікувань.');
INSERT INTO public.zodiac_compatibility VALUES (71, 9, 11, 70, 'Відносини між Терезами і Стрільцем у більшості випадків є благотворним зв''язком, який дозволяє цим партнерам розвивати свій емоційний, внутрішній світ і будувати своє життя без негативних впливів. Однак між ними існує архетипна боротьба, оскільки Сатурн підноситься в Терезах і не дуже піклується про свого сина, Юпітера, правителя Стрільця. Це може легко призвести до боротьби за верховенство і битви за домінуючу позицію між ними. Це є продовженням пораненого Сонця Терезів, а Стрілець ідеально впишеться в необхідність відмовитися від будь-якого почуття гордості через деякі дитячі переконання. Єдиний спосіб для них бути щасливими разом — це повністю поважати один одного і дозволяти один одному робити те, що вони повинні робити. Терези повинні дотримуватися своїх стосунків і кохання, якими керує Венера, а Стрілець повинен дотримуватися своїх переконань і широти поглядів, якими керує Юпітер, примножуючи кохання, яке дарують Терези.');
INSERT INTO public.zodiac_compatibility VALUES (72, 9, 12, 35, 'Якщо ми хочемо вибрати найкраще слово для опису стосунків між партнерами-Терезами та Козерогами, то це буде слово «складні». Це не означає, що вони не будуть насолоджуватися спільним життям або не залишаться у стосунках надовго, але це, безумовно, не той зв''язок, на який зважилися б багато інших знаків зодіаку. Їх найбільшою проблемою є відсутність поваги до емоційної цінності, яка зазвичай ініціюється Козерогом, але легко продовжується Терезами. Якщо вони знайдуть спосіб ділитися, показувати і розуміти емоції один одного, все інше здаватиметься легким завданням.');
INSERT INTO public.zodiac_compatibility VALUES (73, 10, 10, 65, 'Скорпіон і Скорпіон мають схильність виявляти в один одному найгірше. Хоча вони можуть поділяти найглибше взаєморозуміння з усіх знаків зодіаку, вони також можуть занадто занурюватися в темряву і депресію, потопаючи у своїх невирішених емоціях. Їхнє емоційне взаєморозуміння є чимось, що варто цінувати, якщо вони обоє відкриті до своїх почуттів і приймають свої внутрішні потреби.');
INSERT INTO public.zodiac_compatibility VALUES (74, 10, 11, 30, 'Скорпіон і Стрілець складають чудову пару, поки вони відчувають перше захоплення на початку своїх стосунків. Поки вони ще не знають один одного добре і все здається новим і неймовірним, Скорпіон буде бачити свого партнера-Стрільця як промінь світла, який раптово робить його життя яскравішим і кращим, а Стрілець побачить, що є так багато чого дізнатися і насолодитися глибиною свого партнера-Скорпіона, а потім і емоційною прихильністю. Згодом є велика ймовірність, що вони повільно втратять інтерес одне до одного, особливо мінливий знак Стрільця до свого стабільного партнера-Скорпіона. Навіть якщо їхні стосунки можуть закінчитися на поганих умовах, було б шкода не піддатися їм і не дозволити їм зачарувати і піднести обох на якийсь час.');
INSERT INTO public.zodiac_compatibility VALUES (75, 10, 12, 65, 'Стосунки Скорпіона і Козерога можуть надихати обох партнерів на пошук істини, дослідження свого родоводу та вирішення невирішених кармічних проблем і боргів. Вони обоє глибокі і не ставляться до речей легковажно, що допоможе їм побудувати міцний фундамент для стосунків, які можуть тривати довго. Однак саме це може легко зробити їхні стосунки занадто похмурими і беземоційними, занурити їх обох у стан смутку і депресії або просто пробудити в них потребу шукати світло з кимось іншим.');
INSERT INTO public.zodiac_compatibility VALUES (76, 11, 11, 75, 'Один Стрілець легко закохається в іншого, і їхні пристрасні стосунки можуть дуже швидко змінитися. Як два представники мінливого знака, вони легко пристосуються, але з такою ж легкістю змінять свої думки та почуття один до одного. Це не завжди обіцяє довгострокові стосунки, адже немає партнера, який би був клеєм, що тримає їх разом. Це не означає, що вони не будуть насолоджуватися компанією один одного, знаходити багато спільного, коли вони разом, і сміятися, як діти, перебуваючи на одному шляху. Якщо вони відкриють для себе справжнє щастя двох людей, на яких впливає Юпітер, вони можуть втратити інтерес до всіх інших і знайти той необхідний баланс, який утримає їх разом у їхніх подорожах протягом усього життя.');


--
-- Data for Name: zodiac_prediction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.zodiac_prediction VALUES (7, 7, 'Today, Leo, your feelings might be intensified. A member of your circle could be facing a challenge with someone in a position of authority, and discussions about politics may arise. You might feel a surge of strength and be inclined to get involved. However, it would be wiser to steer clear of political matters and instead focus that energy and enthusiasm on your personal endeavors. This approach is much more likely to yield fruitful outcomes.', 'Сьогодні, Леви, ваші почуття можуть загостритися. Хтось із вашого оточення може зіткнутися з проблемою з кимось, хто має владу, і можуть виникнути дискусії про політику. Ви можете відчути приплив сил і захотіти втрутитися в ситуацію. Однак, було б розумніше триматися подалі від політичних питань і натомість зосередити цю енергію та ентузіазм на ваших особистих починаннях. Такий підхід з набагато більшою ймовірністю принесе плідні результати.', '2025-08-26');
INSERT INTO public.zodiac_prediction VALUES (5, 8, 'Today, Virgo, you may feel an overwhelming urge to conquer new challenges. A surge of excitement and a sense of purpose could invigorate your spirit, leaving you curious about its origin, especially since your circumstances seem unchanged from yesterday. Instead of pondering its source, seize this energy! Dive into a new class or fitness routine, or kick off a project you''ve been considering. This vibrant energy is rooted deep within you and is eager to manifest in your everyday life!', 'Сьогодні, Діви, ви можете відчути непереборне бажання підкорити нові вершини. Сплеск азарту і відчуття мети можуть підбадьорити ваш дух, змусивши вас замислитися над його походженням, тим більше, що ваші обставини, здається, не змінилися у порівнянні з учорашнім днем. Замість того, щоб роздумувати над його джерелом, скористайтеся цією енергією! Пориньте у новий клас або фітнес-програму, або розпочніть проект, який ви давно обмірковували. Ця жива енергія корениться глибоко всередині вас і прагне проявитися у вашому повсякденному житті!', '2025-08-02');
INSERT INTO public.zodiac_prediction VALUES (4, 9, 'You might find yourself experiencing a surprising surge of success today, which could lead to an equally surprising increase in your income. Friends may have played a crucial role in guiding you to this fortunate moment. Be prepared for this shift to propel you into a new chapter of your life. Embrace this opportunity fully, but remember not to become complacent; if you do, your newfound success could vanish just as quickly as it arrived.', 'Можливо, сьогодні ви відчуваєте несподіваний сплеск успіху, який може призвести до не менш несподіваного зростання вашого доходу. Друзі, можливо, зіграли вирішальну роль у наближенні цього щасливого моменту. Будьте готові до того, що цей зсув підштовхне вас до нової глави вашого життя. Скористайтеся цією можливістю, але пам''ятайте, що не варто заспокоюватися; якщо ви це зробите, ваш новознайдений успіх може зникнути так само швидко, як і з''явився.', '2025-11-16');
INSERT INTO public.zodiac_prediction VALUES (8, 3, 'This morning, Aries, you might find yourself feeling a little off due to some recent excesses. It''s best to steer clear of coffee and other pick-me-ups. If possible, allow yourself to catch some extra sleep. The stress you''ve been carrying isn''t doing you any favors either. While this sluggish feeling may lift by midday, it''s important to reflect on your recent habits if this has become a pattern. Consider what changes you can make to break the cycle.', 'Сьогодні вранці, Овни, ви можете відчути себе трохи не в своїй тарілці через нещодавні надмірності. Краще утриматися від кави та інших напоїв, що підвищують настрій. Якщо є можливість, дозвольте собі трохи поспати. Стрес, який ви пережили, теж не йде вам на користь. Хоча до полудня відчуття млявості може зникнути, важливо проаналізувати свої нещодавні звички, якщо вони вже стали звичкою. Подумайте, які зміни ви можете зробити, щоб розірвати це коло.', '2025-08-23');
INSERT INTO public.zodiac_prediction VALUES (6, 12, 'Today marks a shift in how you view your relationships. Previously guided by emotions, you''re now inclined to adopt a more logical perspective. While this newfound approach may initially seem like it could dampen your joy, it has the potential to foster deeper, more resilient connections.', 'Сьогоднішній день знаменує собою зміну в тому, як ви бачите свої стосунки. Якщо раніше ви керувалися емоціями, то тепер схильні дивитися на речі більш логічно. Хоча спочатку може здатися, що цей новий підхід може затьмарити вашу радість, він може сприяти створенню глибших і стійкіших зв''язків.', '2025-11-22');


--
-- Data for Name: zodiac_sign; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.zodiac_sign VALUES (1, 'aquarius');
INSERT INTO public.zodiac_sign VALUES (2, 'pisces');
INSERT INTO public.zodiac_sign VALUES (3, 'aries');
INSERT INTO public.zodiac_sign VALUES (4, 'taurus');
INSERT INTO public.zodiac_sign VALUES (5, 'gemini');
INSERT INTO public.zodiac_sign VALUES (6, 'cancer');
INSERT INTO public.zodiac_sign VALUES (7, 'leo');
INSERT INTO public.zodiac_sign VALUES (8, 'virgo');
INSERT INTO public.zodiac_sign VALUES (9, 'libra');
INSERT INTO public.zodiac_sign VALUES (10, 'scorpio');
INSERT INTO public.zodiac_sign VALUES (11, 'sagittarius');
INSERT INTO public.zodiac_sign VALUES (12, 'capricorn');


--
-- Name: credentials_key_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.credentials_key_id_seq', 120, true);


--
-- Name: dislike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dislike_id_seq', 560, true);


--
-- Name: gender_gender_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gender_gender_id_seq', 4, true);


--
-- Name: interest_interest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interest_interest_id_seq', 12, true);


--
-- Name: like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.like_id_seq', 251, true);


--
-- Name: matches_match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matches_match_id_seq', 15, true);


--
-- Name: meeting_feedbacks_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.meeting_feedbacks_feedback_id_seq', 5, true);


--
-- Name: meetings_meeting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.meetings_meeting_id_seq', 13, true);


--
-- Name: partner_preferences_preference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partner_preferences_preference_id_seq', 127, true);


--
-- Name: preference_interest_preference_interest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preference_interest_preference_interest_id_seq', 18, true);


--
-- Name: preference_signs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preference_signs_id_seq', 238, true);


--
-- Name: refusals_refusal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refusals_refusal_id_seq', 5, true);


--
-- Name: restore_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restore_code_id_seq', 11, true);


--
-- Name: user_images_user_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_images_user_image_id_seq', 172, true);


--
-- Name: user_interest_user_interest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_interest_user_interest_id_seq', 335, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 120, true);


--
-- Name: zodiac_compatibility_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zodiac_compatibility_id_seq', 156, true);


--
-- Name: zodiac_prediction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zodiac_prediction_id_seq', 8, true);


--
-- Name: zodiac_sign_sign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zodiac_sign_sign_id_seq', 12, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: credentials credentials_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_login_key UNIQUE (login);


--
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (key_id);


--
-- Name: dislike dislike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dislike
    ADD CONSTRAINT dislike_pkey PRIMARY KEY (id);


--
-- Name: gender gender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (gender_id);


--
-- Name: interest interest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest
    ADD CONSTRAINT interest_pkey PRIMARY KEY (interest_id);


--
-- Name: like like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_pkey PRIMARY KEY (id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (match_id);


--
-- Name: meeting_feedbacks meeting_feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meeting_feedbacks
    ADD CONSTRAINT meeting_feedbacks_pkey PRIMARY KEY (feedback_id);


--
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (meeting_id);


--
-- Name: partner_preferences partner_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_preferences
    ADD CONSTRAINT partner_preferences_pkey PRIMARY KEY (preference_id);


--
-- Name: preference_interest preference_interest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_interest
    ADD CONSTRAINT preference_interest_pkey PRIMARY KEY (preference_interest_id);


--
-- Name: preference_signs preference_signs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_signs
    ADD CONSTRAINT preference_signs_pkey PRIMARY KEY (id);


--
-- Name: refusals refusals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refusals
    ADD CONSTRAINT refusals_pkey PRIMARY KEY (refusal_id);


--
-- Name: restore_code restore_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restore_code
    ADD CONSTRAINT restore_code_pkey PRIMARY KEY (id);


--
-- Name: user_images user_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_pkey PRIMARY KEY (user_image_id);


--
-- Name: user_interest user_interest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interest
    ADD CONSTRAINT user_interest_pkey PRIMARY KEY (user_interest_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: zodiac_compatibility zodiac_compatibility_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_compatibility
    ADD CONSTRAINT zodiac_compatibility_pkey PRIMARY KEY (id);


--
-- Name: zodiac_prediction zodiac_prediction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_prediction
    ADD CONSTRAINT zodiac_prediction_pkey PRIMARY KEY (id);


--
-- Name: zodiac_prediction zodiac_prediction_sign_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_prediction
    ADD CONSTRAINT zodiac_prediction_sign_id_key UNIQUE (sign_id);


--
-- Name: zodiac_sign zodiac_sign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_sign
    ADD CONSTRAINT zodiac_sign_pkey PRIMARY KEY (sign_id);


--
-- Name: credentials credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: dislike dislike_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dislike
    ADD CONSTRAINT dislike_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: dislike dislike_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dislike
    ADD CONSTRAINT dislike_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: like like_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: like like_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: matches matches_user1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: matches matches_user2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: meeting_feedbacks meeting_feedbacks_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meeting_feedbacks
    ADD CONSTRAINT meeting_feedbacks_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(meeting_id);


--
-- Name: meeting_feedbacks meeting_feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meeting_feedbacks
    ADD CONSTRAINT meeting_feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: meetings meetings_user1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: meetings meetings_user2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: partner_preferences partner_preferences_gender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_preferences
    ADD CONSTRAINT partner_preferences_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.gender(gender_id);


--
-- Name: partner_preferences partner_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_preferences
    ADD CONSTRAINT partner_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: preference_interest preference_interest_interest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_interest
    ADD CONSTRAINT preference_interest_interest_id_fkey FOREIGN KEY (interest_id) REFERENCES public.interest(interest_id);


--
-- Name: preference_interest preference_interest_preference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_interest
    ADD CONSTRAINT preference_interest_preference_id_fkey FOREIGN KEY (preference_id) REFERENCES public.partner_preferences(preference_id) ON DELETE CASCADE;


--
-- Name: preference_signs preference_signs_preference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_signs
    ADD CONSTRAINT preference_signs_preference_id_fkey FOREIGN KEY (preference_id) REFERENCES public.partner_preferences(preference_id) ON DELETE CASCADE;


--
-- Name: preference_signs preference_signs_sign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preference_signs
    ADD CONSTRAINT preference_signs_sign_id_fkey FOREIGN KEY (sign_id) REFERENCES public.zodiac_sign(sign_id);


--
-- Name: refusals refusals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refusals
    ADD CONSTRAINT refusals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: restore_code restore_code_creds_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restore_code
    ADD CONSTRAINT restore_code_creds_id_fkey FOREIGN KEY (creds_id) REFERENCES public.credentials(key_id);


--
-- Name: user_images user_images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_interest user_interest_interest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interest
    ADD CONSTRAINT user_interest_interest_id_fkey FOREIGN KEY (interest_id) REFERENCES public.interest(interest_id);


--
-- Name: user_interest user_interest_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interest
    ADD CONSTRAINT user_interest_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users users_gender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_gender_fkey FOREIGN KEY (gender) REFERENCES public.gender(gender_id);


--
-- Name: users users_sign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_sign_id_fkey FOREIGN KEY (sign_id) REFERENCES public.zodiac_sign(sign_id);


--
-- Name: zodiac_compatibility zodiac_compatibility_sign1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_compatibility
    ADD CONSTRAINT zodiac_compatibility_sign1_id_fkey FOREIGN KEY (sign1_id) REFERENCES public.zodiac_sign(sign_id);


--
-- Name: zodiac_compatibility zodiac_compatibility_sign2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_compatibility
    ADD CONSTRAINT zodiac_compatibility_sign2_id_fkey FOREIGN KEY (sign2_id) REFERENCES public.zodiac_sign(sign_id);


--
-- Name: zodiac_prediction zodiac_prediction_sign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zodiac_prediction
    ADD CONSTRAINT zodiac_prediction_sign_id_fkey FOREIGN KEY (sign_id) REFERENCES public.zodiac_sign(sign_id);


--
-- PostgreSQL database dump complete
--

