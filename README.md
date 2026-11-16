# ApiFestivosFrontEnd

Aplicativo web en Angular para administrar y consultar los festivos de la API REST `apiFestivos`.

Incluye:

- CRUD de Tipos de Festivo, Países y Festivos
- Página de Consulta de validación de Festivos (verificar si una fecha es festiva y listar los festivos de un país durante un año)

## Requisitos

- Node.js 20.19+ o 22.12+
- La API REST `apiFestivos` corriendo en `https://localhost:7041` con la base de datos `Festivos` creada

## Desarrollo

Instalar dependencias:

```
npm install
```

Iniciar el servidor de desarrollo:

```
npm start
```

Abrir `http://localhost:4200/` en el navegador.

La URL de la API se configura en `src/environments/environment.ts`.
