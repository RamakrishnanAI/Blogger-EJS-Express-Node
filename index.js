import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";

// Helper function to read data from the JSON file safely
const readJsonFile = (filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf8'); // Read file as string
    return JSON.parse(rawData); // Parse string into a JavaScript variable
};

// Helper function to write data back to the JSON file
const writeJsonFile = (filePath, data) => {
    // Convert variable back to formatted JSON string
    const jsonString = JSON.stringify(data, null, 2); 
    fs.writeFileSync(filePath, jsonString, 'utf8');
};

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const blog_list_path = path.join(__dirname, 'data/blog-list.json');

var user = null;
let blogData = readJsonFile(blog_list_path);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  res.render('index.ejs', { 
    activePage: 'home',
    user: user,
    blogList: blogData.blog_list,
    topBlogs: blogData.top_blogs,
    topCategories: blogData.top_categories
  });
});

app.get('/about', (req, res) => {
  res.render('about.ejs', { 
    activePage: 'about',
    user: user
  });
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs', { 
    activePage: 'contact',
    user: user
  });
});

app.get('/login', (req, res) => {
  res.render('login.ejs', { 
    activePage: 'login',
    user: user
  });
});

app.get('/blogs/:id', (req, res) => {
  const blogId = req.params.id;
  const blog = blogData.blog_list.find(b => b.blog_id === blogId);

  if (blog) {
    res.render('blog.ejs', { 
      activePage: 'blogs',
      user: user,
      blog: blog,
      topBlogs: blogData.top_blogs,
      topCategories: blogData.top_categories
    });
  } else {
    res.status(404).send('Blog not found');
  }
});
