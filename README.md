

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

DATABASE_URL="uri conexión"

PORT=el puerto

JWT_SECRET="llave secreta"
JWT_EXPIRES_IN="tiempo de expiración"

```

- genere las migraciones locales :

```bash
npx prisma init
npx prisma generate
```

- finalmente ponga a correr el proyecto de forma local

```bash
npm run dev
```