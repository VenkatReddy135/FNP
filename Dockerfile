FROM 811454692736.dkr.ecr.ap-south-1.amazonaws.com/revvit2/prod/nginx:1.21.0-alpine

#RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_orig

WORKDIR /usr/share/nginx/html
COPY .devops/default.conf /etc/nginx/conf.d/

COPY ./build /usr/share/nginx/html
