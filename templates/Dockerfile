FROM python:3.7-alpine

COPY . /responsive_games_app

WORKDIR /responsive_games_app

RUN apk --update add mysql-client

RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD python ./run.py