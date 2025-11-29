#npm run-script build:prod
#tar cvzf dist.tgz dist/
scp -i "~/LocalDocuments/Proyectos/Pechugon/aws/pos-instance.pem" ./dist.tgz ec2-user@ec2-3-138-197-62.us-east-2.compute.amazonaws.com:~/dist.tgz
#scp -i "~/LocalDocuments/Proyectos/Pechugon/aws/pos-instance.pem" ./deploy.server ec2-user@ec2-3-138-197-62.us-east-2.compute.amazonaws.com:~/deploy.sh
#ssh -t -i "~/LocalDocuments/Proyectos/Pechugon/aws/pos-instance.pem" ec2-user@ec2-3-138-197-62.us-east-2.compute.amazonaws.com '/bin/sh deploy.sh'