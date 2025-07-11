## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev



To connect the database with your backend run
psql -U postgres -d lost_and_found -h localhost -W
```

<!-- dumping the local -->

pg_dump \
 --format=custom \
 --no-owner \
 --no-privileges \
 --dbname='postgresql://postgres:AmAn%21%40%23%24@localhost:5432/lost_and_found' \
 --file=lost_and_found.dump

<!-- restore in neon -->

pg_restore \
 --verbose \
 --clean \
 --no-owner \
 --no-privileges \
 --dbname='postgres://neondb_owner:npg_vMZNdIS16QHO@ep-twilight-mountain-adql070a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require' \
 lost_and_found.dump
