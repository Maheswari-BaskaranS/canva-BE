# POC *
Proof of Concept

## Features

- **Environment variables**: using [custom-env](https://github.com/erisanolasheni/custom-env)
- **Logging, httpErrorLogs, httpSuccessLogs & httpperformanceLogs)**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Linting**: with [ESLint](https://eslint.org), [Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base), [Prettier](https://prettier.io), [Node](https://www.npmjs.com/package/eslint-config-node) and [Security](https://github.com/nodesecurity/eslint-plugin-security)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)
- **Response & Code handler**
- **Script commands** Script commands for Seeder and Migration, with and without Docker, can be executed on Linux and Windows for local, stage, and production environments.

## Getting Started

Clone the repo and make it yours:

```bash
git clone --depth 1 https://github.com/lillastar824/youCanFly_Backend.git
rm -rf .git
```
now add your Git Repo

## Install Dependency
- npm install

## Set your environment variables:

```bash
# Can use for Dev
- env/.env.dev

# Can use for Prod
- env/.env.prod

# Create your own Env and add your scripts to package.json
- cp env/.env.example env/.env
```
## Update Node_ENV script in /config/vars.js before exporting env variables for local :
- const nodeEnv = require('custom-env');
- nodeEnv.env(NODE_ENV || process.env.NODE_ENV || 'local', './env');

## Run your project:

```bash
# Run Dev
- npm run start:dev

# Run  Prod
- npm run start:prod
```

## Run your project using Docker:
# Conigure your Local/Server with Docker 
```bash
# Create image, make sure your src/log directory is empty
- docker build --build-arg <arg-variable-name>=<arg-variable-value> -t <image-name>:<image-version>  .
# ex for local env
- docker build --build-arg RUNTIME=local -t myappimage:local  .
# ex for dev env
- docker build --build-arg RUNTIME=dev -t myappimage:dev  .
# ex for prod env
- docker build --build-arg RUNTIME=prod -t myappimage:prod  .

# Create a direcory and copy the folter path, You need this on creating log named volume
- mkdir applog

# Set the appropriate permissions on the directory so that it can be accessed by the container. 
- chmod -R 0777 applog/

# Create a new Docker named volume and apply the path on the folder that you have created before 
- docker volume create --driver local  --opt type=none --opt device=<local-path> --opt o=bind <volume-name>
# ex
- docker volume create --driver local  --opt type=none --opt device=/home/tlspc-070/Works/applog --opt o=bind applog



# Run  Prod  Container
- docker run -d --rm -p 8090:8090 -name <container-name> -v <volume-name>:<container-file-path> <image-name>:<image-version>
# ex
- docker run -d -rm -p 8090:8090 -name myAppcontainer -v applog:/app/logs myappimage:latest

# Run  Dev Container
# Note that this command maps the host directory /home/tlspc-070/Works/youCanFlyinetrnalbe/ to the container's /app directory with read-only (ro) access. It also maps the volume applog to the container's /app/src/logs directory, and mounts the /app/node_modules directory from within the container. The container runs the myappimage:latest image and is named myAppcontainer. Finally, the container is started in detached mode (-d) and will be automatically removed when it exits (--rm).
- docker run -d --rm -p 8090:8090 --name <container-name> -v "<local-path>:<WORKDIR>:ro" -v <volume-name>:<container-file-path> -v <container-file-path> <image-name>:<image-version>
# ex
- docker run -d --rm -p 8090:8090 --name myAppcontainer -v "/home/tlspc-070/Works/youCanFlyinetrnalbe/:/app:ro" -v applog:/app/logs -v /app/node_modules myappimage:latest
```
# If you are working on local DB and facing connectivity issue, Follow the steps, Also works for Oracle VM on Windows
```bash
# locate your cnf file for MariaDB /etc/mysql/mariadb.conf.d/50-server.cnf
# Edit bind-address Change the IP address in this line to your server's public IP address or set it to 0.0.0.0 to listen on all available network interfaces
# Restart the MariaDB
- sudo systemctl restart mariadb

# create a MariaDB user that can access the server from a remote machine. Replace user and password with your preferred username and password. The % character in the command means that the user can connect from any IP address. If you want to restrict access to a specific IP address or range, replace % with the IP address or subnet in CIDR notation, such as 192.168.0.0/24.
- GRANT ALL ON *.* TO 'user'@'%' IDENTIFIED BY 'password';

# Allow incoming connections to port 3306 on your server's firewall
- sudo ufw allow 3306/tcp

# Find your network enp0s3: IPV4/inet address Linux 
- ip a

# Find your network IPV4 address windows 
- ifconfig

# Replace it on the DB env file
- DB_HOST = 10.0.2.15

# CMD test
- sudo mysql -h 10.0.2.15 -u user -p
```
# Other Docker commands
```bash
# See log of container 
- docker logs <container-name>

# Stop the container 
- docker stop <container-name>

# Stop the container 
- docker start <container-name>

# To see all container 
- docker ps -a

# To see running container 
- docker ps

# To remove container
- docker rm <container-name>

# To see all images 
- docker images

# To remove images
- docker rmi <image-name>

# To see all volume 
- docker volume ls

# To remove volume
- docker volume rm <volume-name>

# inspect a volume
- docker volume inspect <volume-name>

# if you have installed your docker as sudo and not able to run docker without sudo privilege
- sudo usermod -aG docker $USER

# To check the user running the Docker container, By default, Docker containers run as the root user inside the container
- docker exec <container-name> whoami

# To change Docker containers user add 
- --user "$(id -u):$(id -g)"
- --user root 

# To check the ownership of a named volume in Docker
- sudo docker volume inspect <volume-name>

# Enter into the Docker container's shell
- docker exec -it <container-name> /bin/bash
```
## Other Commands
Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```
## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

VS Code: Install the ESLint & Prettier extension to have better experience.

## Husky & lint-staged

Stop ourselves from committing, if the codes have ESLint & Prettier issues.

Install dependencies when switching branches.

### Editor config

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

VS Code: Install the Editor config extension, also a global module if not working `npm i -g editorconfig` once done restart VS Code.

## Inspirations

 - [ hagopj13/node-express-boilerplate ](https://github.com/hagopj13/node-express-boilerplate)
 
## License

Licensed under the [MIT License](LICENSE).
