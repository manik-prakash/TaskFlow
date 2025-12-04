Todo App (Docker + Kubernetes)

This is a simple Todo app with a Nextjs frontend, Node.js backend, and MongoDB database.
I containerized each service ( frontend , backend , DB , nginx ) separately and deployed them on a Kubernetes cluster.
It's a 3 - node cluster 
I have used ClusterIP for internal communication and one LoadBalancer which is connected to a reverse-proxy (nginx).