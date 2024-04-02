import { keystoneContext } from '../../../src/keystone/context';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function registerRoute(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    console.log('body:', req.body);

    // Validate the input data
    if ( !email || !password) {
        return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    const user = await keystoneContext.query.User.createOne({
        data: {
            name: 'root',
            email: email,
            password: password,
        },
    });
    console.log('User:', user);
    console.log('Email:', email);
    console.log('Password:', password);

    // Return a success response
    return res.status(200).json({ message: 'Registration successful' });
}