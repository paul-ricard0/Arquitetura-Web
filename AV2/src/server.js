const express = require('express'); 
const jsonwebtoken = require('jsonwebtoken'); 

const PRIVATE_KEY = '1010FFF'
const user = {
  name: 'Michelle Hanne',
  email: 'michelle@exmaple.com'
}

function tokenValited(
    request,
    response,
    next
  ) {
    const [, token] = request.headers.authorization?.split(' ') || [' ', ' '];
    
    if(!token) return response.status(401).send('Access denied. No token provided.');
  
    try {
      const payload = jsonwebtoken.verify(token, PRIVATE_KEY);
      const userIdFromToken = typeof payload !== 'string' && payload.user;
  
      if(!user && !userIdFromToken) {
        return response.send(401).json({ message: 'Invalid token' });
      }
  
      request.headers['user'] = payload.user;
  
      return next();
    } catch(error) {
      console.log(error);
      return response.status(401).json({ message: 'Invalid token' });
    }
  }


const api = express();
api.use(express.json());

api.get('/', (_, res) => res.status(200).json({
  message: 'This is a PUBLIC router...'
}));

api.get('/login', (req, res) => {
  const [, hash] = req.headers.authorization?.split(' ') || [' ', ' '];
  const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

  try {
    const correctPassword = email === 'michelle@exmaple.com' && password === '123456';

    if (!correctPassword) return response.status(401).send('Password or E-mail incorrect!');

    const token = jsonwebtoken.sign(
      { user: JSON.stringify(user) },
      PRIVATE_KEY,
      { expiresIn: '60m' }
    );

    return res.status(200).json({ data: { user, token } });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

api.use('*', tokenValited);

api.get('/private', (req, res) => {
  const { user } = req.headers
  const currentUser = JSON.parse(user);
  return res.status(200).json({
    message: 'This is a PRIVATE router...',
    data: {
      userLogged: currentUser
    }
  })
});

api.listen(3333, () => console.log('server running...'));