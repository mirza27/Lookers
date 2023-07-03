# Lookers
Lookers is Full Web Job Seeker With Express JS and PostgreSQL. 
It's final project of semester 2 web programming workshop course PENS.

# Feature summary
You can use this application by logging in as a job seeker or HR / job vacancy maker. As a job seeker, you can search for jobs, apply jobs and delete applications that you apply.
As an HR, you can make a job application or delete it, you can also temporarily activate / deactivate your vacancy, you can accept applications made by job seekers.



## Demo




you can see our demo 
https://drive.google.com/file/d/1AUfaaxhMyc6k5UYNUe6gbjkvQL6UFDk6/view?usp=sharing


## Screenshots
login page as jobseeker or HRD
![Login](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)

homepage
![hompage](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)

you can search jobs with the keyword
![findjobs](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)

the jobs you applied
![myapplicant](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)

you make a job as HRD
![addjob](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)

the job you made
![myjobs](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)

you can accept or decline someone applicants
![acceptapplicants](https://drive.google.com/file/d/1ccrO_2VFLSR6v-aSbEXmcgSQYiGMv6RY/view?usp=sharing)


## Installation
Make sure that you have installed node js

Install all the packages using npm

```bash
cd lookers
npm install bcrypt
npm install cookie-parser
npm install ejs
npm install express-session
npm install cookie-parser
npm install pg-promise
```
edit the database variable connection db/db.js using your localhost postgresql
```bash
// load database
const connection = {
    host: "localhost",
    port: 7572,
    database: "postgres",
    user: "postgres",
    password: "your password",
  };
``` 
generate the sql table from db/table.sql on your local server PostgreSQL
```bash
pg_dump -U username -d db_name -f table.sql
```
you can start the server and make account for the first time
```bash
node app.js
```
## Authors

- [@mirza27](https://www.github.com/mirza27)
- [@andraalayubi](https://www.github.com/andraalayubi)
- [@ianbom](https://www.github.com/ianbom)

