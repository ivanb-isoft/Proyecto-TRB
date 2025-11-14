--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE exp_trb;
--
-- Name: exp_trb; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE exp_trb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';


ALTER DATABASE exp_trb OWNER TO postgres;

\connect exp_trb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: centrodecostos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.centrodecostos (
    divisionid character(20) NOT NULL,
    divisiondescription character(40) NOT NULL
);


ALTER TABLE public.centrodecostos OWNER TO postgres;

--
-- Name: centrodecostosdepartamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.centrodecostosdepartamento (
    divisionid character(20) NOT NULL,
    ccdepartamentoid character(20) NOT NULL,
    ccdepartamentodescription character(40) NOT NULL
);


ALTER TABLE public.centrodecostosdepartamento OWNER TO postgres;

--
-- Name: clienteid; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clienteid
    START WITH 80
    INCREMENT BY 1
    MINVALUE 80
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clienteid OWNER TO postgres;

--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    clienteid integer DEFAULT nextval('public.clienteid'::regclass) NOT NULL,
    clientenombre character varying(100) NOT NULL,
    clienteactivo boolean NOT NULL,
    clientefechaalta date NOT NULL,
    clientefechabaja date
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: concepto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concepto (
    conceptoid smallint NOT NULL,
    conceptodescripcion character varying(100)
);


ALTER TABLE public.concepto OWNER TO postgres;

--
-- Name: costoaprorratear; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.costoaprorratear (
    costoaprorratearanio smallint NOT NULL,
    costoaprorratearmes smallint NOT NULL,
    costoaprorratearmontoaprorrate numeric(11,2) NOT NULL,
    costoaprorrateartotalhoras integer NOT NULL
);


ALTER TABLE public.costoaprorratear OWNER TO postgres;

--
-- Name: departamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamento (
    departamentoid character(12) NOT NULL,
    departamentodescripcion character varying(100) NOT NULL
);


ALTER TABLE public.departamento OWNER TO postgres;

--
-- Name: departamentocc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentocc (
    departamentoccid character(20) NOT NULL,
    departamentoccdescription character(40) NOT NULL
);


ALTER TABLE public.departamentocc OWNER TO postgres;

--
-- Name: departamentoccdivision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentoccdivision (
    departamentoccid character(20) NOT NULL,
    divisionccid character(20) NOT NULL,
    divisionccdescription character(40) NOT NULL
);


ALTER TABLE public.departamentoccdivision OWNER TO postgres;

--
-- Name: equipoid; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipoid
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipoid OWNER TO postgres;

--
-- Name: equipo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipo (
    equipoid smallint DEFAULT nextval('public.equipoid'::regclass) NOT NULL,
    equipodescripcion character varying(100) NOT NULL,
    equipoactivo boolean NOT NULL,
    equipofechaalta date NOT NULL,
    equipofechabaja date
);


ALTER TABLE public.equipo OWNER TO postgres;

--
-- Name: log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log (
    logid integer NOT NULL,
    logproceso character(60),
    logarchivo character(60),
    logtimestamp timestamp without time zone,
    logobservaciones character varying(9999)
);


ALTER TABLE public.log OWNER TO postgres;

--
-- Name: movimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento (
    movimientoid integer NOT NULL,
    clienteid integer NOT NULL,
    proyectoid integer NOT NULL,
    profesionalid integer NOT NULL,
    movimientofecha date NOT NULL,
    movimientohoras bigint NOT NULL,
    movimientominutos bigint NOT NULL,
    movimientodescripcion character varying(300) NOT NULL,
    movimientofechahora timestamp without time zone NOT NULL,
    conceptoid smallint NOT NULL,
    equipoid smallint,
    movimientoprofesionalid integer NOT NULL,
    proyectotareaid integer,
    movimientotarea bigint
);


ALTER TABLE public.movimiento OWNER TO postgres;

--
-- Name: nolaborable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nolaborable (
    nolaborablefecha date NOT NULL,
    nolaborabledescripcion character varying(100) NOT NULL
);


ALTER TABLE public.nolaborable OWNER TO postgres;

--
-- Name: parametros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parametros (
    parametroid smallint NOT NULL,
    parametrovalor character(10) NOT NULL
);


ALTER TABLE public.parametros OWNER TO postgres;

--
-- Name: profesional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesional (
    profesionalid integer NOT NULL,
    profesionalnombre character varying(100) NOT NULL,
    profesionalapellido character varying(100) NOT NULL,
    profesionalhorastrabajo bigint NOT NULL,
    profesionalcargahoras boolean NOT NULL,
    profesionalactivo boolean NOT NULL,
    departamentoid character(12),
    proveedorid integer,
    usuarioid integer,
    profesionalhorasdisponibles bigint,
    profesionalfechaalta date,
    profesionalfechabaja date,
    profesionallegajo character(15),
    divisionid character(20),
    ccdepartamentoid character(20)
);


ALTER TABLE public.profesional OWNER TO postgres;

--
-- Name: profesionalhoras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesionalhoras (
    profesionalid integer NOT NULL,
    horasaniovigencia smallint NOT NULL,
    horasmesvigencia smallint NOT NULL,
    horascantidadatrabajar smallint NOT NULL
);


ALTER TABLE public.profesionalhoras OWNER TO postgres;

--
-- Name: proveedorid; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proveedorid
    START WITH 12
    INCREMENT BY 1
    MINVALUE 12
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedorid OWNER TO postgres;

--
-- Name: proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor (
    proveedorid integer DEFAULT nextval('public.proveedorid'::regclass) NOT NULL,
    proveedordescripcion character varying(100) NOT NULL,
    proveedoractivo boolean NOT NULL
);


ALTER TABLE public.proveedor OWNER TO postgres;

--
-- Name: proyecto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyecto (
    clienteid integer NOT NULL,
    proyectoid integer NOT NULL,
    proyectodescripcion character varying(100) NOT NULL,
    proyectodeptoid character(12) NOT NULL,
    proyectoresponsableid integer NOT NULL,
    proyectofechacreacion date NOT NULL,
    proyectofechacorte date,
    proyectofechacierre date,
    proyectoactivo boolean NOT NULL,
    proyectocontratohoras integer,
    proyectocontratofechainicio date,
    proyectocontratofechafin date,
    proyectocontratourl character varying(1000),
    proyectocontratoordencompra character(30),
    proyectotipo smallint,
    proyectofechaactivacion date NOT NULL,
    proyectofechadesactivacion date,
    proyectotareacount smallint NOT NULL
);


ALTER TABLE public.proyecto OWNER TO postgres;

--
-- Name: proyectobugzilla; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectobugzilla (
    clienteid integer NOT NULL,
    proyectoid integer NOT NULL,
    proyectobugzillaid integer NOT NULL
);


ALTER TABLE public.proyectobugzilla OWNER TO postgres;

--
-- Name: proyectoprofesional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectoprofesional (
    clienteid integer NOT NULL,
    proyectoid integer NOT NULL,
    proyectoprofesionalid integer NOT NULL
);


ALTER TABLE public.proyectoprofesional OWNER TO postgres;

--
-- Name: proyectotarea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectotarea (
    clienteid integer NOT NULL,
    proyectoid integer NOT NULL,
    proyectotareaid integer NOT NULL,
    proyectotareadesc character varying(100) NOT NULL,
    proyectotareafechadesde date NOT NULL,
    proyectotareafechahasta date NOT NULL,
    proyectotareaesfuerzo smallint NOT NULL
);


ALTER TABLE public.proyectotarea OWNER TO postgres;

--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: valorsueldo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valorsueldo (
    profesionalid integer NOT NULL,
    valorsueldoanio smallint NOT NULL,
    valorsueldomes smallint NOT NULL,
    valorsueldocostototal numeric(11,2) NOT NULL,
    valorsueldototalhoras smallint NOT NULL
);


ALTER TABLE public.valorsueldo OWNER TO postgres;

--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Data for Name: centrodecostos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.centrodecostos (divisionid, divisiondescription) FROM stdin;
\.


--
-- Data for Name: centrodecostosdepartamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.centrodecostosdepartamento (divisionid, ccdepartamentoid, ccdepartamentodescription) FROM stdin;
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (clienteid, clientenombre, clienteactivo, clientefechaalta, clientefechabaja) FROM stdin;
1	Intersoft	t	2025-11-13	1001-01-01
\.


--
-- Data for Name: concepto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.concepto (conceptoid, conceptodescripcion) FROM stdin;
\.


--
-- Data for Name: costoaprorratear; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.costoaprorratear (costoaprorratearanio, costoaprorratearmes, costoaprorratearmontoaprorrate, costoaprorrateartotalhoras) FROM stdin;
\.


--
-- Data for Name: departamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamento (departamentoid, departamentodescripcion) FROM stdin;
\.


--
-- Data for Name: departamentocc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentocc (departamentoccid, departamentoccdescription) FROM stdin;
\.


--
-- Data for Name: departamentoccdivision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentoccdivision (departamentoccid, divisionccid, divisionccdescription) FROM stdin;
\.


--
-- Data for Name: equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipo (equipoid, equipodescripcion, equipoactivo, equipofechaalta, equipofechabaja) FROM stdin;
\.


--
-- Data for Name: log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log (logid, logproceso, logarchivo, logtimestamp, logobservaciones) FROM stdin;
\.


--
-- Data for Name: movimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento (movimientoid, clienteid, proyectoid, profesionalid, movimientofecha, movimientohoras, movimientominutos, movimientodescripcion, movimientofechahora, conceptoid, equipoid, movimientoprofesionalid, proyectotareaid, movimientotarea) FROM stdin;
\.


--
-- Data for Name: nolaborable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nolaborable (nolaborablefecha, nolaborabledescripcion) FROM stdin;
\.


--
-- Data for Name: parametros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parametros (parametroid, parametrovalor) FROM stdin;
\.


--
-- Data for Name: profesional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesional (profesionalid, profesionalnombre, profesionalapellido, profesionalhorastrabajo, profesionalcargahoras, profesionalactivo, departamentoid, proveedorid, usuarioid, profesionalhorasdisponibles, profesionalfechaalta, profesionalfechabaja, profesionallegajo, divisionid, ccdepartamentoid) FROM stdin;
\.


--
-- Data for Name: profesionalhoras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesionalhoras (profesionalid, horasaniovigencia, horasmesvigencia, horascantidadatrabajar) FROM stdin;
\.


--
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proveedor (proveedorid, proveedordescripcion, proveedoractivo) FROM stdin;
\.


--
-- Data for Name: proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyecto (clienteid, proyectoid, proyectodescripcion, proyectodeptoid, proyectoresponsableid, proyectofechacreacion, proyectofechacorte, proyectofechacierre, proyectoactivo, proyectocontratohoras, proyectocontratofechainicio, proyectocontratofechafin, proyectocontratourl, proyectocontratoordencompra, proyectotipo, proyectofechaactivacion, proyectofechadesactivacion, proyectotareacount) FROM stdin;
\.


--
-- Data for Name: proyectobugzilla; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectobugzilla (clienteid, proyectoid, proyectobugzillaid) FROM stdin;
\.


--
-- Data for Name: proyectoprofesional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectoprofesional (clienteid, proyectoid, proyectoprofesionalid) FROM stdin;
\.


--
-- Data for Name: proyectotarea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectotarea (clienteid, proyectoid, proyectotareaid, proyectotareadesc, proyectotareafechadesde, proyectotareafechahasta, proyectotareaesfuerzo) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, email, nombre, apellido, password) FROM stdin;
1	admin@intersoft.com	Admin	Usuario	$2b$10$B9jTdp0uJ34Eu0.k.IMlte.tude4U9T9h/ivntEYaLr5DFOCd1YWO
3	marianon@intersoft.com	mariano	natil	$2b$10$zKVwGwxYkoKpK.adYaIomeWlAWzEJE8JsE9DvqdaaLGlw8yYRAU/C
4	ivanb@intersoft.com	ivan	bores	$2b$10$1iVPDr5nYYfq3JtJqaxPiOnj3JzJ9BCKF.qtEUMEzNIGtUZdGSOGu
\.


--
-- Data for Name: valorsueldo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valorsueldo (profesionalid, valorsueldoanio, valorsueldomes, valorsueldocostototal, valorsueldototalhoras) FROM stdin;
\.


--
-- Name: clienteid; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clienteid', 80, false);


--
-- Name: equipoid; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipoid', 1, false);


--
-- Name: proveedorid; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedorid', 12, false);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 4, true);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

