import express from 'express';
import axios from 'axios';
import redis from 'redis';

const app = express();
app.use(express.json());
const redisport = 6379;
const redishost = 'redis://127.0.0.1:6379';
const client = redis.createClient(redishost);
client.connect();

app.get('/redis/:id', async (req, res) => {
	const { id } = req.params;
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const cacheTodo = await client.get(`todo-${id}`);

	if (cacheTodo) {
		return res.json(JSON.parse(cacheTodo));
	}

	const { data } = await axios.get(
		`https://jsonplaceholder.typicode.com/todos/${id}`,
		config
	);
	await client.set(`todo-${id}`, JSON.stringify(data));
	return res.json(data);
});

app.listen(5000, () => {
	console.log('server is running on port 5000');
});
