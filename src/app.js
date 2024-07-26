const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

const app = express();

require('./dbs/mongo');
const StudentModel = require('./models/Student.model');

const service = {
  StudentService: {
    StudentServicePort: {
      addStudent: async (args, callback) => {
        try {
          const newStudent = new StudentModel({
            name: args.name,
            age: args.age
          });
          await newStudent.save();
          callback({ result: 'Student added successfully' });
        } catch (error) {
          callback({ result: 'Error adding student' });
        }
      },
      listStudents: async (args, callback) => {
        try {
          const students = await StudentModel.find();

          const studentsXml = xmlbuilder.create('students');

          students.forEach(student => {
            studentsXml.ele('student')
              .ele('_id', student._id.toString()).up()
              .ele('name', student.name).up()
              .ele('age', student.age).up()
              .ele('__v', student.__v).up();
          });

          const xmlString = studentsXml.end({ pretty: true });

          callback({ students: xmlString });
        } catch (error) {
          console.error('Error fetching students', error);
          callback({ students: 'Error fetching students' });
        }
      },
      updateStudent: async (args, callback) => {
        try {
          const student = await StudentModel.findById(args.id);
          if (student) {
            student.name = args.name;
            student.age = args.age;
            await student.save();
            callback({ result: 'Student updated successfully' });
          } else {
            callback({ result: 'Student not found!' });
          }
        } catch (error) {
          callback({ result: 'Error updating student' });
        }
      },
      deleteStudent: async (args, callback) => {
        try {
          const student = await StudentModel.findByIdAndDelete(args.id);
          if (student) {
            callback({ result: 'Student deleted successfully' });
          } else {
            callback({ result: 'Student not found!' });
          }
        } catch (error) {
          callback({ resuilt: 'Error deleting student' });
        }
      },
      getStudentById: async (args, callback) => {
        try {
          const student = await StudentModel.findById(args.id);
          if (student) {
            const studentXml = xmlbuilder.create('student')
              .ele('_id', student._id.toString()).up()
              .ele('name', student.name).up()
              .ele('age', student.age).up()
              .ele('__v', student.__v).end({ pretty: true });
            callback({ student: studentXml });
          } else {
            callback({ student: 'Student not found' });
          }
        } catch (error) {
          callback({ student: 'Error fetching student!' })
        }
      }
    }
  }
};

const wsdl = fs.readFileSync(path.join(__dirname, './DefinationWsdl/wsdl.xml'), 'utf8');

soap.listen(app, '/soap', service, wsdl);

module.exports = app;