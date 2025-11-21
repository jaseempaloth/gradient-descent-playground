# Gradient Descent Visualizer

An interactive 3D visualization of gradient descent algorithms built with Next.js, React Three Fiber, and Tailwind CSS.

## Features

- **3D Function Visualization**: Explore mathematical functions like Quadratic Bowl, Rosenbrock, Saddle Point, and Sinusoidal surfaces in 3D.
- **Interactive Gradient Descent**: Watch the descent algorithm in real-time.
- **Custom Functions**: Enter your own mathematical expressions (e.g., `x^2 + y^2`).
- **Controls**: Adjust learning rate, iteration speed, and toggle visual aids like wireframes and gradient vectors.
- **Responsive Design**: Works on various screen sizes.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **3D Graphics**: React Three Fiber (Three.js)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## How it Works

1. **Select a Function**: Choose a built-in function or enter a custom one.
2. **Adjust Parameters**: Set the learning rate and iteration speed.
3. **Start**: Click "Start" to begin the gradient descent simulation.
4. **Observe**: Watch the red sphere move towards the local minimum (or diverge if parameters are too aggressive). The yellow line traces the path.

## Future Improvements

- Add more optimization algorithms (Momentum, Adam, etc.).
- Add contour map projection.
- Add more complex custom function parsing.
