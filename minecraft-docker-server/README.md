# ⛏️ Minecraft Server Dockerized (PaperMC)

Este repositorio contiene la infraestructura necesaria para desplegar un servidor de Minecraft (Java Edition) de alto rendimiento utilizando **Docker** y **Docker Compose**. Está configurado para ser ligero, persistente y compatible tanto con cuentas Premium como No-Premium.

## 🚀 Características
- **Motor:** [PaperMC](https://papermc.io/) (Optimizado para bajo consumo de CPU/RAM).
- **Modo:** Compatible con No-Premium (`online-mode: false`).
- **Persistencia:** Los datos se guardan en el host local para evitar pérdidas tras reiniciar contenedores.
- **Administración:** Gestión remota mediante RCON integrada.

---

## 📋 Requisitos Previos
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Recursos recomendados:** Mínimo 4GB de memoria RAM.

---

## ⚙️ Instalación y Configuración

1. Clona este repositorio:

        `git clone https://github.com/tu-usuario/minecraft-docker-server.git`
        `cd minecraft-docker-server`

2. Configura el entorno:

    Crea o edita el archivo .env con los siguientes parámetros básicos:

        • EULA_ACCEPT=TRUE
        • MC_VERSION=LATEST
        • SERVER_TYPE=PAPER
        • MEMORY_LIMIT=4G

3. Inicia el servidor:

    `docker-compose up -d`

---

## 🎮 Conectividad

1. Conexión Local (LAN):

    Para probar el servidor desde la misma computadora o red:

        Dirección: localhost o la IP privada de tu PC (ej. 192.168.1.15).
        Puerto: 25565 (por defecto).

2. Conexión Remota (Amigos):

    Para que otros entren desde internet:

        Realiza un Port Forwarding en tu router: Redirige el puerto 25565 (TCP/UDP) a la IP local de tu servidor.
        Comparte tu IP Pública (puedes verla en cualesmiip.com).
 
---

## 🕹️ Operaciones Comunes (Mantenimiento)

**Gestión de Jugadores (Dar OP):**

  Para dar permisos de administrador a un jugador, usa el siguiente comando desde la terminal:

    `docker exec -i minecraft-server rcon-cli op TuNombreDeUsuario`

**Guardado y Apagado Seguro**

Es fundamental guardar el mundo antes de apagar el contenedor:

- **Guardar mundo:** `docker exec -i minecraft-server rcon-cli save-all`
- **Apagar servidor:** `docker-compose down`
- **Encender servidor:** `docker-compose up -d`
- **Ver Consola en Tiempo Real:** `docker logs -f minecraft-server`

---

## 📁 Gestión de Datos y Backups

Todos los datos críticos residen en la carpeta ./data.
Hacer un Backup: Comprime la carpeta data y guárdala en un lugar seguro.
Instalar Plugins: Coloca los archivos .jar en ./data/plugins y reinicia el servidor.
Configuración Avanzada: Edita ./data/server.properties para ajustar límites de jugadores, dificultad, etc.

---

## ⚠️ Notas de Seguridad

El servidor está configurado en Modo No-Premium (ONLINE_MODE: "FALSE"). Esto permite que cualquier usuario entre con cualquier nombre. Si planeas abrirlo a todo el público, se recomienda encarecidamente instalar un plugin de autenticación como AuthMe Reloaded.