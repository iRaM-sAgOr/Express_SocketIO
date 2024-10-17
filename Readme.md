# Project Run

$npm install & npm run dev

# Topics Cover:

1. Logged in users communcation in both global or one to one
2. Guest connected users' communication in both global or one to one
3. Screen shot is availabel to know the flow
4. Redis adapter integrated

# Future Topics:

1. Integrate different types of adapter
2. Store authorizes user's data for both global and one to one

# To add Redis adapter first need to run the Redis

$ docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
- Then run the app A in 3001 port. another 3002, then from client side send message, 
- we can see they are communicating
Though they are connected with different servers but with same redis adapter
