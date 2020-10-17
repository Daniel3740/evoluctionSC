--
-- PostgreSQL database dump
--

-- Dumped from database version 10.14 (Ubuntu 10.14-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 12.3

-- Started on 2020-10-17 18:05:35

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

--
-- TOC entry 197 (class 1259 OID 17891)
-- Name: users; Type: TABLE; Schema: public; Owner: userdb
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text,
    password text NOT NULL,
    creation_date timestamp without time zone NOT NULL,
    token text NOT NULL
);


ALTER TABLE public.users OWNER TO userdb;

--
-- TOC entry 196 (class 1259 OID 17889)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: userdb
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 2874 (class 0 OID 17891)
-- Dependencies: 197
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: userdb
--



--
-- TOC entry 2880 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: userdb
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 2751 (class 2606 OID 17898)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: userdb
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2020-10-17 18:05:58

--
-- PostgreSQL database dump complete
--

