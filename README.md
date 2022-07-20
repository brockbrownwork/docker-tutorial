# docker-getting-started

## How to launch the Docker container:
> docker build -t getting-started . <br />
> docker run -dp 3000:3000 getting-started <br />

## To push the instance...
> docker tag getting-started YOUR-USER-NAME/getting-started <br />
> docker push YOUR-USER-NAME/getting-started <br/>

## To make a volume that persists...
> docker volume create todo-db <br/>
> docker run -dp 3000:3000 -v todo-db:etc/todos getting-started <br />

## To run the instance in development mode...<br/>
(Auuggh this isn't working right now, and I'm not sure why)<br/>
cd into the docker-tutorial folder then run the following... <br/>
> docker run -dp 3000:3000 -w /app -v "$(pwd):/app" node:12-alpine sh -c "yarn install && yarn run dev"
