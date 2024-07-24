'use strict';

const express = require('express');
const crypto = require('crypto');
const wrRoute = express.Router();
const connection = require('../db');

wrRoute.post('/students', async (req, res, next) => {
    try {
        await connection.execute(
            `INSERT INTO students (first_name, last_name, email, major, enrollment_year) 
            VALUES (?, ?, ?, ?, ?);`,
            [req.body.first_name, req.body.last_name, req.body.email, req.body.major, req.body.enrollment_year]
        );

        console.log('Insert successfully');
        res.status(201).send('Insert Successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

wrRoute.get('/students', async (req, res, next) => {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM students;');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

wrRoute.get('/students/:id', async (req, res, next) => {
    const studentId = req.params.id;
    try {
        const [rows, fields] = await connection.execute(
            'SELECT * FROM students WHERE student_id = ?;',
            [studentId]
        );
        if (rows.length === 0) {
            return res.status(404).send('Student not found');
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

wrRoute.put('/students/:id', async (req, res, next) => {
    const studentId = req.params.id;
    const { first_name, last_name, email, major, enrollment_year } = req.body;

    try {
        const [result] = await connection.execute(
            `UPDATE students
            SET first_name = ?, last_name = ?, email = ?, major = ?, enrollment_year = ?
            WHERE student_id = ?;`,
            [first_name, last_name, email, major, enrollment_year, studentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found');
        }

        res.status(200).send('Update Successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

wrRoute.delete('/students/:id', (req, res, next) => {
    connection.execute(
      "DELETE FROM students WHERE student_id=?;",
      [req.params.student_id]
    )
    .then(() => {
      console.log('Delete successfully');
      res.status(200).send('Delete Successfully.');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  });

module.exports = wrRoute;