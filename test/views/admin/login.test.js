const request = require('supertest');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// Assuming the login route is defined in the app
app.post('/admin/login', (req, res) => {
    // Mock login logic for testing
    const { password } = req.body;
    if (password === 'correct_password') {
        res.status(200).send('Login Successful');
    } else {
        res.status(401).render('admin/login', { error: 'Invalid password' });
    }
});

describe('Admin Login Page', () => {
    it('test_admin_login_success', async () => {
        const response = await request(app)
            .post('/admin/login')
            .send({ password: 'correct_password' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Login Successful');
    });

    it('test_login_form_display', async () => {
        const response = await request(app)
            .get('/admin/login');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('<form action="/admin/login" method="POST">');
    });

    it('test_login_error_message_display', async () => {
        const response = await request(app)
            .post('/admin/login')
            .send({ password: 'wrong_password' });
        expect(response.statusCode).toBe(401);
        expect(response.text).toContain('Invalid password');
    });

    it('test_empty_password_submission', async () => {
        const response = await request(app)
            .post('/admin/login')
            .send({ password: '' });
        expect(response.statusCode).toBe(401);
        expect(response.text).toContain('Invalid password');
    });

    it('test_no_error_message_without_error', async () => {
        const response = await request(app)
            .get('/admin/login');
        expect(response.statusCode).toBe(200);
        expect(response.text).not.toContain('alert alert-danger');
    });

    it('test_unexpected_input_handling', async () => {
        const response = await request(app)
            .post('/admin/login')
            .send({ password: '<script>alert("hack")</script>' });
        expect(response.statusCode).toBe(401);
        expect(response.text).toContain('Invalid password');
    });

    it('test_valid_input_submission', async () => {
        const response = await request(app)
            .post('/admin/login')
            .send({ password: 'correct_password' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Login Successful');
    });

    it('test_no_javascript_submission', async () => {
        const response = await request(app)
            .post('/admin/login')
            .send({ password: 'correct_password' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Login Successful');
    });
});