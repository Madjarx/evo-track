ARG ELK_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/elasticsearch/elasticsearch:${ELK_VERSION}

# Add your elasticsearch plugins setup here
# Example: RUN elasticsearch-plugin install analysis-icu

ENV ES_JAVA_OPTS "-Xms1024m -Xmx1024m"

# NOTE: defined within docker-compose file as well (we can hardcode it within the Dockerfile when we need it in the image on docker-hub)
#ENV ELASTIC_USERNAME "evolab"
#ENV ELASTIC_PASSWORD "evoeco"

ADD config/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
