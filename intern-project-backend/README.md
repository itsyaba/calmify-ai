<h1 align="center">Welcome to backend code for our internship project 👋</h1>

## Written below is instruction to integrate Mood tracking feature.

## First, you must signup or login

## Clone the repository

```sh
https://github.com/PixelFlows2/intern-project-backend.git
```

## Install the dependencies by running the following code

```sh
npm install
```

Create .env file and add the following values to the file.

```sh
OPENAI_API_KEY=open_ai_api_key
MONGODB_ATLAS="your mongodb atlas api"
PORT=5000
TOKEN_SECRET="f7184f99b71a947afe96623b9811e04c455955c734ec1e7ddb917734e03128f2126b101e60d61e4ad7
245295178378bf44fbc1e4b57092ba0e82faa73a76379c";
NODE_ENV="development"
FRONTEND_PORT="http://localhost:5173"
```

Run the Application by Navigating to 'intern-project-backend' folder:

```sh
npm start
```

## Step 1: fetch questions for mood tracking

There are 10 questions written and stored on the backend.These questions will be filled by the user daily.
The questions are always the same and will never be changed.

```sh
URL: http://localhost:5000//mood_tracking/mood_tracking_questions

Request Method: "GET"

when you make request to the backend, make sure to send cookies together with the request!

Successful  Response from the backend contains the following object:
 {
  success: true,
  questions: [
  {
    id: 1,
    question: "How would you rate your overall mood today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Very bad", "Bad", "Neutral", "Good", "Very good"],
  },
  {
    id: 2,
    question: "How much energy did you have throughout the day?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["None", "Low", "Moderate", "High", "Very high"],
  },
  {
    id: 3,
    question: "How well did you sleep last night?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Very poor", "Poor", "Fair", "Good", "Excellent"],
  },
  {
    id: 4,
    question: "How stressed did you feel today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: 5,
    question: "How socially connected did you feel today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: [
      "Very isolated",
      "Somewhat isolated",
      "Neutral",
      "Connected",
      "Very connected",
    ],
  },
  {
    id: 6,
    question: "How motivated were you to complete daily tasks?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: 7,
    question: "How anxious did you feel today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: 8,
    question: "How often did you experience negative thoughts today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 9,
    question: "How satisfied are you with your personal relationships today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: [
      "Not satisfied",
      "Slightly satisfied",
      "Neutral",
      "Satisfied",
      "Very satisfied",
    ],
  },
  {
    id: 10,
    question: "How hopeful do you feel about the future today?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
]
}

```

## Step 2: send user responses to the backend

# Look at the react component example below to see how user responses are recorded and sent to the backend

```sh
URL: http://localhost:8000/mood_tracking/submit_mood_tracking_answers

Request Method: "POST"

Request Body should have array of user responses.
when you make request to the backend, make sure to send cookies together with the request!

Successful  Response from the backend contains the following object:
 {
  success: true,
  message: "Mood responses submitted successfully",
}

```

## The following React component fetches questions, records user responses and sends responses

```sh
import React, { useState, useEffect } from "react";
import axios from "axios";

const MoodTrackingForm = () => {
  const [questions, setQuestions] = useState<
    { id: number; question: string; scale: number[]; labels: string[] }[]
  >([]);
  const [responses, setResponses] = useState({});
  const [message, setMessage] = useState("");

  // The "fetchQuestions" function inside useEffect will fetch daily mood tracking questions from the backend.

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/mood_tracking/mood_tracking_questions",
          {
            withCredentials: true,
          }
        );
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // The following function  will handle responses from the user.
  const handleChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  // The "handleSubmit" function will send user rsponses to the backend.

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/mood_tracking/submit_mood_tracking_answers",
        {
          responses: Object.entries(responses).map(([questionId, answer]) => ({
            question:
              questions.find((q) => q.id === parseInt(questionId))?.question ||
              "",
            answer,
          })),
        },
        {
          withCredentials: true,
        }
      );
      console.log("Responses", responses);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error submitting responses:", error);
      setMessage("Failed to submit responses");
    }
  };

  return (
    <div>
      <h2>Mood Tracking</h2>
      <form onSubmit={handleSubmit}>
        {questions?.map((question) => (
          <div key={question.id}>
            <label>{question.question}</label>
            <select
              title="select"
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleChange(question.id, parseInt(e.target.value))
              }
            >
              <option value="" disabled>
                Select an option
              </option>
              {question.scale.map((option, index) => (
                <option key={option} value={option}>
                  {question.labels[index]}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MoodTrackingForm;

```

## Step 3: Fetch average mood score from the backend and display the result on a line chart

```sh
URL: "http://localhost:8000/mood_tracking/mood_tracking_average",

Request Method: "GET"

when you make request to the backend, make sure to send cookies together with the request!

Successful  Response from the backend contains the following object:

 {
  success: true,
    user_ID: user_ID,
   dailyAverages: dailyAverages, # Please note that dailyAverages is not array, it is an object
}

```

## The following react component fetches average mood score from the backend and displays the result on a line chart

First Install necessary dependencies for the Line chart to work perfectly

```sh

npm install chart.js react-chartjs-2

```

```sh

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailyMoodChart = () => {
  const [dailyAverages, setDailyAverages] = useState({});
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const fetchDailyAverages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/mood_tracking/mood_tracking_average",
          {
            withCredentials: true,
          }
        );
        const averages = response.data.dailyAverages;
        setDailyAverages(averages);
        setLabels(Object.keys(averages));
        setData(Object.values(averages));
      } catch (error) {
        console.error("Error fetching daily averages:", error);
      }
    };

    fetchDailyAverages();
  }, []);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Daily Mood Average",
        data: data,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: (chart) => {
            return [
              {
                text: "Good Mood (4.0 - 5.0)",
                fillStyle: "rgba(75,192,192,1)",
              },
              {
                text: "Mixed Mood (2.6 - 3.9)",
                fillStyle: "rgba(192,192,75,1)",
              },
              {
                text: "Bad Mood (1.0 - 2.5)",
                fillStyle: "rgba(192,75,75,1)",
              },
            ];
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Daily Mood Averages</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DailyMoodChart;


```

## Written below is instruction to integrate AI chat functionality to the frontend part of the App

## First, you must signup or login on the frontend

## Clone the repo

```sh
https://github.com/PixelFlows2/intern-project-backend.git
```

## Install the dependencies

```sh
npm install
```

Before you run the backend, Create .env file and add the following values to .env file. You need to replace MONGODB_ATLAS API key by your own API key. Other .env values are provided. If you don't have API key for OpenAI, please visit https://platform.openai.com/api-keys and create API key.

```sh
OPENAI_API_KEY=open_ai_api_key
MONGODB_ATLAS="your mongodb atlas api"
PORT=5000
TOKEN_SECRET="f7184f99b71a947afe96623b9811e04c455955c734ec1e7ddb917734e03128f2126b101e60d61e4ad7
245295178378bf44fbc1e4b57092ba0e82faa73a76379c";
NODE_ENV="development"
FRONTEND_PORT="http://localhost:5173"
```

Run the Application by Navigating to 'intern-project-backend' folder then write the following

```sh
npm start
```

Check if the express server is working by visiting the following URL. If your App is working, you will get success message.

```sh
http://localhost:5000/
```

## API endpoints to have conversation with AI and retrieve conversations are given below

NB: The AI model used here is chatgpt-turbo-3.5 as it has generous free version but in the future another AI model from Hugging face will be used.

see the AI_CHAT model schema in 'models' folder to have full understanding of the schema used.

## Start new chat with AI

NB: when you make request to the backend, make sure to send cookies together with the request. Otherwise, user authentication will fail.

```sh
URL: http://localhost:5000/chat/chat_with_ai

Request Method: "POST"

Request Body should have chat_ID (string) and user_question (string).

NB: To start a new chat with AI, 'chat_ID' should be empty string.

Example of request body to be sent from frontend to the backend: {
  chat_ID: "",
  user_question: "Tell me about Typescript", }

Successful  Response from AI contains the following object:
 {
  success: true,
  message: "Successful response from AI",
  chat_ID: "679f8cd15c74af5ea1131154",
  chat_title: "Typed superset of JavaScript.",
  AI_response: "TypeScript is an open-source programming language developed and maintained by
  Microsoft. It is a superset of JavaScript that adds static typing to the language, allowing
  developers to catch errors and enforce type safety at compile time. TypeScript code is transpiled
  into plain JavaScript code that can be run in any browser or JavaScript runtime....",
}

```

## To continue the conversation with AI

NB: when you make request to the backend, make sure to send cookies together with the request. Otherwise, user authentication will fail.

```sh
URL: http://localhost:5000/chat/chat_with_ai

Request Method: "POST"

Request Body should have chat_ID (string) and user_question (string).

NB: To continue the conversation with AI, assign value to the  'chat_ID'. You get the 'chat_ID'
from the initial conversation.

For example, chat_ID: "679f8cd15c74af5ea1131154"

Example of request body to be sent from frontend to the backend: {
  chat_ID: "679f8cd15c74af5ea1131154",
  user_question: "Tell me about C#", }

Successful  Response from AI contains the following object: {
  success: true,
  message: "Successful response from AI",
  chat_ID: "679f8cd15c74af5ea1131154",
  chat_title: "Typed superset of JavaScript.",
  AI_response: ""C# (pronounced as "C sharp") is a modern, general purpose, object-oriented
  programming language developed by Microsoft as part of its .NET framework. C# was created by
  Anders Hejlsberg and his team during the early 2000s and is influenced by C++, Java, and other
  programming languages....", }

```

## Fetch all previous conversations with AI

NB: when you make request to the backend, make sure to send cookies together with the request. Otherwise, user authentication will fail.

```sh
URL: http://localhost:5000/chat/previous_chats

Request Method: "GET"

You don't need to send anything from frontend to the backend to fetch previous conversations.
It will automatically access user_ID from the jason_web_token in the browser cookies.


Successful  Response from AI contains the following object:
 { success: true, allChats: [all_chats_stored_in_array] }

```

## Fetch one conversation

NB: when you make request to the backend, make sure to send cookies together with the request. Otherwise, user authentication will fail.

```sh
URL: http://localhost:5000/chat/find_chat/:chat_ID

Request Method: "GET"
Request Body should have chat_ID (string).

 For example, http://localhost:5000/chat/find_chat/:679f8cd15c74af5ea1131154


Successful  Response from AI contains the following object: { success: true, chat: getChatByID,}

```

## Written below is instruction to perform Authentication and authorization and integrate the backend with the frontend part of the App

## First Clone the repo

```sh
https://github.com/PixelFlows2/intern-project-backend.git
```

## Install the dependencies

```sh
npm install
```

Before you run the backend, Create .env file and add the following values to .env file. You need to replace MONGODB_ATLAS API key by your own API key. Other .env values are provided.

```sh
MONGODB_ATLAS="your mongodb atlas api"
PORT=5000
TOKEN_SECRET="f7184f99b71a947afe96623b9811e04c455955c734ec1e7ddb917734e03128f2126b101e60d61e4ad7245295178378bf44fbc1e4b57092ba0e82faa73a76379c";
NODE_ENV="development"
FRONTEND_PORT="http://localhost:5173"
```

Run the Application. Navigate to the 'intern-project-backend' folder then write the following

```sh
npm start
```

Check if the express server is working by visiting the following URL. If your App is working, you will get success message.

```sh
http://localhost:5000/
```

## API endpoints to create, login, logout and authorize users are given below.

## Create new user

NB: passport library with passport-jwt is used for user authentication and authorization. We use Json web Token which will be automatically stored in the browser cookies under the name "internship" whenever user signup or Login is successful.

```sh
URL: http://localhost:5000/user/create_user

Request Method: "POST"

Request Body should have username (string), email (string) and password (string). Example of request body to be sent from frontend to the backend: {
  username: "pixelflow",
  email: "pixelflow@gmail.com",
  password: "ABCabc@1234"
}

Successful Signup Response contains the following object:
 {
  success: true,
  message: "Signup Successful!",
  user: { username:"string", email:"string", password:"string" },
}

```

## Login user

Json web Token will be automatically stored in the browser cookies under the name "internship" when the user login is successful.

```sh
URL: http://localhost:5000/user/login_user

Request Method: "POST"

Request Body should have only  email  and password. Example of request body to be sent from frontend to the backend:
{
  email: "pixelflow@gmail.com",
  password: "ABCabc@1234"
}

Successful Login Response  contains the following object:
{
  success: true,
  message: "Login Successful!",
  user: { username:"string", email:"string", password:"string" },
}
```

## Logout user

Json web Token will be removed from the browser-cookies user Logout is successful.

```sh
URL: http://localhost:5000/user/logout_user

Request Method: "GET"

Successful Logout Response contains the following object:
{
success: true, message: "Logout successful",
}
```

## To grant Access to protected routes (example - Dashboard)

Json web Token should be sent from browser-cookies to the backend whenever user authorization is required to give access to protected routes (Dashboard).

```sh
URL: http://localhost:5000/user/protected_route

Request Method: "GET"

Successful authorization Response contains the following object:
{
success: true,
message: "User successfully authenticated! You can access your dashboard",
}
```

## Author

👤 **keyr**

---
