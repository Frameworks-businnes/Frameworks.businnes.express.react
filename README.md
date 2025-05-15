

# pasos para correr el proyecto 

- Primero clone el proyecto con :

```bash
git clone https://github.com/kyxent-Immortal-Dev/Frameworks.businnes.express.react.git
```


- Entra a la carpeta que te deja al clonar el paquete:

```bash
cd Frameworks.businnes.express.react

```

- instale las dependencias del proyecto :

```bash

npm i 

```

- Cree un archivo llamado .env en la raiz del proyecto
- Debera pedirle al lider del proyecto las variables de entorno

```bash

PORT=3000
 
JWT_SECRET="cPn00oM2S5JOYYkrZ7j3vcnZK3BF5gtIeaPpdbR9DuI"
 
JWT_EXPIRES_IN="1d"
 
DATABASE_URL="mysql://u3oy5djlgv25nkkc:aBV5j0fRI0Lf4Poj1gvi@ba1k0k2bqhihynfoepwb-mysql.services.clever-cloud.com:3306/ba1k0k2bqhihynfoepwb"
 
SHADOW_DATABASE_URL=""
 

```



- genere las migraciones locales :

```bash
npx prisma init
```

- genera de forma local la tablas :
```bash

npx prisma db pull

```

- cree su schema local
```bash
npx prisma generate
```



- finalmente ponga a correr el proyecto de forma local

```bash
npm run dev
```