Dikarenakan menggunakan database

Database + API ( Laravel )
1. Masuk ke absensi-backend
2. composer install
3. copy paster .env.example buang .example sehingga cuman .env
4. php artisan key:generate
5. php artisan migrate
6. php artisan db:seed
7. php artisan serve --host=0.0.0.0 --port=8000

AbsensiAPP
1. buka cmd lalu "ip config" ambil IPv4 Address. . . . . . . . . . . : 192.168.0.100
2. utils/api.ts API_BASE_URL = 'http://192.168.0.100:8000/api' sesuaikan dengan ipconfig yang didapat
3. npm install
4. npx expo start
