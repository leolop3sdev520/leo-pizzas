--
-- PostgreSQL database dump
--

\restrict gKkvwI0D6BDZE7HcnCYSmTD361NtKRwOSClb9OgLogsodTr2UUffrthbOChjJY7

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
24db6354-a59c-48f0-9a8d-aabf45706e9a	efbe33e36c6dfdb8c26e4d2cce321bd6526d2563acf6d7ad1eceef80b2e5f271	2026-10-05 22:27:47.806804-03	20261006012747_create_tables	\N	\N	2026-10-05 22:27:47.706124-03	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, "createdAt", "updatedAt", disabled) FROM stdin;
5579982f-255d-4ee5-b641-ed3ac17fead1	Pizzas	2026-10-12 00:20:34.885	2026-10-12 00:20:34.885	f
eb198503-3910-4dd0-a05d-043ac223f825	Sobremesas	2026-10-15 02:25:28.596	2026-10-15 02:25:28.596	f
91cf529a-98ca-4742-a5f4-0c26c4233b31	Sorvetes	2026-10-27 00:55:53.2	2026-10-27 00:55:53.2	f
b001d333-c778-4cbd-b9c9-24b49f9a8c84	Pizzas Doce	2026-10-27 00:58:13.206	2026-10-27 00:58:13.206	f
7f06bd7b-da2d-43f8-90b0-18f1ec2b279b	Dani Lopes	2026-10-27 02:40:28.74	2026-10-27 02:56:41.571	f
bf539b7b-fffd-428e-aed2-6253db24b672	Petiscos	2026-10-27 01:00:49.083	2026-10-27 02:57:12.813	f
236692e8-c463-4c36-87f9-49ff893048ba	Bebidas	2026-10-12 00:20:45.613	2026-10-27 03:00:34.966	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
e6221c17-bcab-453f-a361-807f29df9ec7	Antonia	testeAntonia@teste.com	$2b$08$p.RlokRHTzxhJpXrmnr.suXmnBzGNTibSrX/h8FL.85QRsPSXc/L.	STAFF	2026-10-10 00:56:05.823	2026-10-10 00:56:05.823
60093ef1-8eee-4ef8-90c8-a341312f83ad	Antonia	testeAntoniaaaaa@teste.com	$2b$08$K.NCzTRhuUUJj8tWpSem7OUPlJ0pqiu2YQgIhREETWWChTzi4foTu	STAFF	2026-10-10 01:41:24.647	2026-10-10 01:41:24.647
92d405d8-525e-4c71-8698-32258d0fdc34	Danielle	dani@teste.com	$2b$08$nXQF999WCsgpLdz4WqdtheN8dqQ.zovgO1ah6dyM77ZAthLWoWNz2	STAFF	2026-10-10 00:46:08.661	2026-10-10 00:46:08.661
e2269f68-5ee3-4210-8013-b5ca33decf40	Leo	leo@teste.com	$2b$08$YbbdLPc.1rcEeJbDQ72gBO82w.s59JzaYtjKahm.cY99UftwRG6/u	STAFF	2026-10-10 00:53:37.783	2026-10-10 00:53:37.783
4adbf2fd-d26f-4bc9-9bb7-81b1dc6023c5	Antonia	testeAntoniaaaaaaaaa@teste.com	$2b$08$Nu4hPdSWkW3/WC3bFCWCeOMigDeCpLjwLK9WFccdD6rCpBZVX77q2	ADMIN	2026-10-10 04:00:55.705	2026-10-10 04:00:55.705
602d9c87-5ef8-4226-b175-7ec5e756bee0	Valentina Lopes	val@teste.com.br	$2b$08$sqLsa2JR.68vDyaa8wgbB.tLwvSp6llVsFEqA68kseYwBT3Pd9oyK	STAFF	2026-10-20 21:16:36.235	2026-10-20 21:16:36.235
a8786159-cf66-44b6-92a8-6b95b25894b3	Dani Lopes	dani@dani.com	$2b$08$40ygmhK2XFJWEpnJnt2e5Osl2BTeg96H8o8q40Yx6HrArfYPykN4.	STAFF	2026-10-20 21:37:24.939	2026-10-20 21:37:24.939
3b914ef4-7533-4f37-aa29-fdce356c0014	leo	leo@leo.com.br	$2b$08$eKE003qBnlPGimfZe7nUpOPNONmEfQOkoxrwZ6u6tLwqdKc7UtSQ2	STAFF	2026-10-20 21:39:35.422	2026-10-20 21:39:35.422
5dea71b7-8b89-427b-b289-3b2db2f660af	João Peido	joao@joao.com	$2b$08$st.iwZaAmF94e1udQaZZ6u/PhMmKx7dfgGdDRlWWZkuIXj6qCxSvq	STAFF	2026-10-20 21:43:23.089	2026-10-20 21:43:23.089
8625d122-9ade-4e60-bf45-c936bb4b1e8d	Leo Lopes DEV	leolopesdev@gmail.com	$2b$08$qy/8FvXpaVPXKE8.DgLnWObt8Crw1ZpffRWOHOnpSelOTFSvw.9xG	STAFF	2026-10-20 21:47:30.438	2026-10-20 21:47:30.438
2cbedcc1-9c63-4b9a-995b-e1c19e6a62e3	Leo Lopes DEV	leolopes@gmail.com	$2b$08$mE6v/CQtpaCe1QP9XVT8P.c/ikHHQZfyq2aV7DxQn/MacD2ztJtvi	STAFF	2026-10-20 21:48:40.366	2026-10-20 21:48:40.366
c40182e1-3499-41e2-9d35-78ef887eca2a	Leo Lopes DEV	leolo@gmail.com	$2b$08$id7f3/.9agK46suRCKSKheiBOCORlIZH7Q/lNK/Z5hyDUxleVb8/C	STAFF	2026-10-20 21:49:47.977	2026-10-20 21:49:47.977
88ad72b4-709a-43b6-9c91-cec9eaa0a73a	Leo Lopes DEV	leolopesdev520@gmail.com	$2b$08$P.2Xei53rEZ460f9QOK.YenHs7JvyiTa5qKNW3tgztVDpMz1HNF36	ADMIN	2026-10-20 21:43:50.844	2026-10-20 21:43:50.844
85925ba5-d5ff-40c7-b51e-5fd4106f6392	admin	admin@admin.com	$2b$08$2OcRF2bcrKyqGGHeyspa3eYqQEjj22z1OT.KrssWkGK/k7kZWQVo2	STAFF	2026-10-27 19:38:36.232	2026-10-27 19:38:36.232
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "table", status, draft, name, "createdAt", "updatedAt", user_id) FROM stdin;
da5d7637-81bf-475f-ab1a-76273b27ba57	13	f	f	Dani	2026-10-27 20:50:30.247	2026-10-27 20:50:52.472	85925ba5-d5ff-40c7-b51e-5fd4106f6392
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, description, banner, disabled, category_id, "createdAt", "updatedAt") FROM stdin;
24ff65b8-5b97-486e-9c83-8a8d5b14f2f9	Pizza de Frango com Catupiry	3900	Pizza com muito catupiry e frango desfiado muito saboroso.	https://res.cloudinary.com/breusknp/image/upload/v1792019499/products/1792019499128-frangocomcatupiry.jpg	f	5579982f-255d-4ee5-b641-ed3ac17fead1	2026-10-14 23:11:40.5	2026-10-15 01:51:43.898
6841664a-2f5c-4881-a182-d6fb90ddb2c6	Pizza Calabresa	3000	Pizza com queijo e calabresa	https://res.cloudinary.com/breusknp/image/upload/v1791937330/products/1791937329101-pizza_calabresa.jpg	f	5579982f-255d-4ee5-b641-ed3ac17fead1	2026-10-14 00:22:10.593	2026-10-14 00:22:10.593
24824b0c-30c0-4e8f-b6b5-dd888543d2a4	Pizza de chocolate	3500	Pizza de chocolate meio amargo 	https://res.cloudinary.com/breusknp/image/upload/v1793065096/products/1793065095714-160722_pizzas-002-v2.png	f	b001d333-c778-4cbd-b9c9-24b49f9a8c84	2026-10-27 01:38:17.129	2026-10-27 01:38:17.129
ff433de9-2e89-45f4-b614-48af96c6d2d3	Pizza Dani lopes	5000	Pizza com brigadeiro e borda de Nutella.	https://res.cloudinary.com/breusknp/image/upload/v1793064969/products/1793064961164-160722_pizzas-002-v2.png	f	7f06bd7b-da2d-43f8-90b0-18f1ec2b279b	2026-10-27 01:36:09.839	2026-10-27 03:28:11.631
b171db25-bf8b-4c0b-b6bc-90d380797a49	Coca lata 350ml	550	coca lata 350ml	https://res.cloudinary.com/breusknp/image/upload/v1793071129/products/1793071127978-Captura%20de%20tela%202026-10-26%20222516.png	t	236692e8-c463-4c36-87f9-49ff893048ba	2026-10-27 01:26:11.894	2026-10-27 22:12:12.159
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, amount, order_id, product_id, "createdAt", "updatedAt", status) FROM stdin;
cc916195-c6dd-4e07-aca4-70e4afda956c	1	da5d7637-81bf-475f-ab1a-76273b27ba57	24824b0c-30c0-4e8f-b6b5-dd888543d2a4	2026-10-27 20:50:37.993	2026-10-27 20:50:37.993	DRAFT
c3587cd7-bb24-45d8-a9c6-8b568a0b2204	3	da5d7637-81bf-475f-ab1a-76273b27ba57	24ff65b8-5b97-486e-9c83-8a8d5b14f2f9	2026-10-27 20:50:47.972	2026-10-27 20:50:47.972	DRAFT
\.


--
-- PostgreSQL database dump complete
--

\unrestrict gKkvwI0D6BDZE7HcnCYSmTD361NtKRwOSClb9OgLogsodTr2UUffrthbOChjJY7

