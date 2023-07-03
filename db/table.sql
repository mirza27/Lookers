BEGIN;


CREATE TABLE IF NOT EXISTS public.users
(
    user_id serial NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    is_employers boolean NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS public.applications
(
    application_id serial NOT NULL,
    jobseeker_id integer NOT NULL,
    job_id integer NOT NULL,
    status character varying NOT NULL,
    PRIMARY KEY (application_id)
);

CREATE TABLE IF NOT EXISTS public.employers
(
    employer_id integer NOT NULL,
    company_name character varying NOT NULL,
    contact_number character varying NOT NULL,
    address character varying,
    company_desc character varying,
    PRIMARY KEY (employer_id)
);

CREATE TABLE IF NOT EXISTS public.jobseekers
(
    jobseeker_id integer NOT NULL,
    name character varying,
    contact_number character varying,
    address character varying,
    is_female boolean,
    PRIMARY KEY (jobseeker_id)
);

CREATE TABLE IF NOT EXISTS public.jobs
(
    job_id serial,
    category_id bigint,
    employer_id integer,
    tittle character varying,
    "desc" character varying,
    salary_min bigint,
    salary_max bigint,
    location character varying,
    exp character,
    is_done boolean,
    PRIMARY KEY (job_id)
);

CREATE TABLE IF NOT EXISTS public.jobseeker_detail
(
    jobseeker_id integer NOT NULL,
    experience text,
    education character varying,
    exp integer,
    PRIMARY KEY (jobseeker_id)
);

CREATE TABLE IF NOT EXISTS public.categories
(
    category_id integer,
    name character varying,
    PRIMARY KEY (category_id)
);

ALTER TABLE IF EXISTS public.applications
    ADD FOREIGN KEY (jobseeker_id)
    REFERENCES public.jobseekers (jobseeker_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.applications
    ADD FOREIGN KEY (job_id)
    REFERENCES public.jobs (job_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.employers
    ADD FOREIGN KEY (employer_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.jobseekers
    ADD FOREIGN KEY (jobseeker_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.jobs
    ADD FOREIGN KEY (employer_id)
    REFERENCES public.employers (employer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.jobs
    ADD FOREIGN KEY (category_id)
    REFERENCES public.categories (category_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.jobseeker_detail
    ADD FOREIGN KEY (jobseeker_id)
    REFERENCES public.jobseekers (jobseeker_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;