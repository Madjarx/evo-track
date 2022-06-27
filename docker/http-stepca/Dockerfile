FROM smallstep/step-ca

# Bad way to move private files into container
# COPY ca-server.crt ca-server.key /home/step/server/
# COPY password /home/step/secrets/password

USER root

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "/usr/local/bin/step-ca --password-file $PWDPATH $CONFIGPATH" ]
