# FROM nginx:alpine as angular-built
# WORKDIR /usr/src/app
# COPY package.json package.json
# RUN npm install --silent
# COPY . .
# RUN ng build --prod

# FROM nginx:alpine
# LABEL author="Mridul"
# COPY --from=angular-built /usr/src/app/dist /usr/share/nginx/html
# EXPOSE 80 443
# CMD [ "nginx", "-g", "daemon off;" ]



#############
### build ###
#############


#FROM node:12.2.0 as build


#WORKDIR /app


#ENV PATH /app/node_modules/.bin:$PATH


#COPY package.json /app/package.json
#RUN npm install


#COPY . /app


#RUN ng build --output-path=dist

############
### prod ###
############


#FROM nginx:1.16.0-alpine


#COPY --from=build /app/dist /usr/share/nginx/html


#COPY ./src/assets /usr/share/nginx/html/src/assets

#EXPOSE 80 443

# run nginx
#CMD ["nginx", "-g", "daemon off;"]


#############
### build ###
#############


FROM node:12.2.0 as build


WORKDIR /app


ENV PATH /app/node_modules/.bin:$PATH


COPY package.json /app/package.json
RUN npm install


COPY . /app


RUN ng build --output-path=dist

############
### prod ###
############


FROM nginx:1.16.0-alpine

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./src/assets /usr/share/nginx/html/src/assets

EXPOSE 80 443

# run nginx
CMD ["nginx", "-g", "daemon off;"]