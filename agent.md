# Gradient Descent Visualizer - Project Documentation

This document describes the complete implementation of an interactive 3D gradient descent visualization web application built with Next.js, React Three Fiber, and TypeScript.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **React Three Fiber (R3F)** - 3D rendering
- **@react-three/drei** - R3F helpers
- **Three.js** - 3D graphics library
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **mathjs** - Mathematical expression parsing and symbolic differentiation

## Project Structure

```
app/
  layout.tsx          # Root layout with global styles
  page.tsx            # Main visualizer page

components/
  Scene/
    Canvas3D.tsx      # R3F canvas setup with camera and controls
    FunctionSurface.tsx   # 3D surface mesh rendering
    GradientPath.tsx      # Trajectory line visualization
    DescentPoint.tsx      # Animated point with gradient arrow
    Axes.tsx              # Reference axes and grid
    Lights.tsx            # Scene lighting setup

  UI/
    ControlsPanel.tsx     # Main control panel container
    FunctionSelector.tsx  # Function dropdown with custom input
    OptimizerSelector.tsx # Optimizer selection (SGD, Momentum, RMSProp, Adam)
    MetricsPanel.tsx      # Real-time metrics and status display

hooks/
  useGradientDescent.ts # Gradient descent animation logic

state/
  useAppState.ts        # Zustand global state store

lib/
  functions.ts          # Function definitions and custom function parser
  gradient.ts           # Numerical gradient computation
  meshGenerator.ts      # Surface mesh generation
```

## Implemented Features

### 1. 3D Visualization

- **Surface Rendering**: Real-time 3D visualization of mathematical functions z = f(x, y)
- **Interactive Camera**: OrbitControls for rotation, pan, and zoom
- **Lighting**: Directional and ambient lighting with shadows
- **Axes & Grid**: Reference coordinate system
- **Wireframe Toggle**: Switch between solid and wireframe view
- **Responsive Canvas**: Adapts to window size

### 2. Mathematical Functions

The application includes 7 built-in functions:

1. **Quadratic Bowl**: `f(x,y) = x² + y²`
   - Simple convex function with global minimum at origin
   - Range: [-2, 2]

2. **Rosenbrock**: `f(x,y) = (1-x)² + 100(y-x²)²`
   - Classic optimization test function with narrow valley
   - Global minimum at (1, 1)
   - Range: [-2, 2]

3. **Saddle Point**: `f(x,y) = x² - y²`
   - Unbounded function demonstrating divergence
   - No global minimum
   - Range: [-2, 2]

4. **Sinusoidal**: `f(x,y) = sin(x)cos(y)`
   - Periodic function with multiple local minima
   - Range: [-π, π]

5. **Himmelblau**: `f(x,y) = (x²+y-11)² + (x+y²-7)²`
   - 4 local minima at different locations
   - Global minimum value: 0
   - Range: [-5, 5]

6. **Beale**: `f(x,y) = (1.5-x+xy)² + (2.25-x+xy²)² + (2.625-x+xy³)²`
   - Single global minimum at (3, 0.5)
   - Narrow valley tests optimizer precision
   - Range: [-4.5, 4.5]

7. **Ackley**: `f(x,y) = -20e^(-0.2√(0.5(x²+y²))) - e^(0.5(cos(2πx)+cos(2πy))) + e + 20`
   - Highly multimodal with many local minima
   - Global minimum at (0, 0)
   - Range: [-5, 5]

8. **Custom Function**: User-defined expressions using mathjs
   - Supports standard mathematical operations
   - Automatic symbolic differentiation
   - Example: `x^2 + y^2*sin(x)`

### 3. Gradient Descent Optimizers

Four optimization algorithms are implemented:

1. **SGD (Stochastic Gradient Descent)**
   - Basic gradient descent: `x_new = x - lr * gradient`
   - Simple and interpretable

2. **Momentum**
   - Adds velocity term: `v = β*v + lr*gradient`
   - Helps overcome local minima
   - Default β = 0.9

3. **RMSProp**
   - Adaptive learning rate per parameter
   - Uses moving average of squared gradients
   - Default β₂ = 0.999, ε = 1e-8

4. **Adam (Adaptive Moment Estimation)**
   - Combines momentum and RMSProp
   - Bias correction for moment estimates
   - Default β₁ = 0.9, β₂ = 0.999, ε = 1e-8

### 4. Smart Stopping Conditions

The gradient descent algorithm includes intelligent stopping detection:

- **Convergence**: Stops when gradient magnitude < 0.001 (minimum found)
- **Divergence**: Detects when gradient consistently increases over 5 iterations (unbounded function)
- **Out of Bounds**: Stops when point moves beyond 2× the function's defined range

### 5. UI Controls

**Function Selection**
- Dropdown with all built-in functions
- Custom function input with debouncing (500ms)
- Real-time expression validation

**Optimizer Selection**
- Dropdown to choose optimization algorithm
- Configurable parameters (momentum, beta2, epsilon)

**Animation Controls**
- Learning Rate slider (0.001 - 1.0)
- Iteration Speed slider (10ms - 1000ms delay)
- Start/Pause/Reset buttons
- Random starting point button

**Visualization Toggles**
- Wireframe mode
- Gradient arrows
- Trajectory path

**Metrics Panel**
- Current function value: f(x,y)
- Gradient magnitude: |∇f|
- Status badges:
  - 🔵 Running (blue)
  - ✓ Converged (green)
  - ✗ Diverged (red)
  - ⚠ Out of Bounds (yellow)

### 6. Interactive Features

- **Click to Set Point**: Click anywhere on the surface to set starting position
- **Real-time Updates**: All changes reflect immediately in 3D scene
- **Trajectory Visualization**: Line following the descent path
- **Gradient Arrow**: Yellow arrow showing steepest descent direction
  - Fixed world-space size (0.8 units)
  - Stays anchored to surface point
  - No camera-dependent scaling

## State Management (Zustand)

The global state includes:

```typescript
{
  // Function selection
  selectedFunctionId: string
  customFunctionExpression: string
  functionVersion: number  // Triggers re-render on custom function change

  // Optimizer settings
  optimizer: 'SGD' | 'Momentum' | 'RMSProp' | 'Adam'
  optimizerParams: {
    momentum: number
    beta2: number
    epsilon: number
  }

  // Animation parameters
  learningRate: number
  iterationSpeed: number
  isRunning: boolean
  isPaused: boolean

  // Descent state
  currentPoint: [x, y, z]
  trajectory: Array<[x, y, z]>
  
  // Metrics
  metrics: {
    currentValue: number
    gradientMagnitude: number
  }
  stoppingReason: 'converged' | 'diverged' | 'bounds' | null

  // Visualization toggles
  showWireframe: boolean
  showGradientArrows: boolean
  showTrajectory: boolean
}
```

## Key Implementation Details

### Custom Function Parsing (mathjs)

The custom function feature uses mathjs for:
- Expression parsing and validation
- Symbolic differentiation (automatic gradient computation)
- Safe evaluation with error handling

```typescript
// Example: User types "x^2 + y^2"
const node = math.parse(expression);
const compiled = node.compile();
const gradXNode = math.derivative(node, 'x');
const gradYNode = math.derivative(node, 'y');
```

### Gradient Descent Loop

Implemented in `useGradientDescent.ts` using React's `useEffect` and `setInterval`:

1. Compute gradient at current point
2. Update optimizer internal state (velocity, momentum, etc.)
3. Calculate step based on optimizer algorithm
4. Update position: `new_point = current_point - step`
5. Check stopping conditions
6. Update metrics and trajectory

### Coordinate System Mapping

- **Math Space**: (x, y) with z = f(x, y)
- **Three.js World Space**:
  - Math X → Three X
  - Math Y → Three Z
  - Math Z → Three Y (vertical axis)

### Gradient Arrow Implementation

The gradient arrow is implemented using THREE.ArrowHelper:
- Lives entirely in world space (no screen-space behavior)
- Fixed length: 0.8 world units
- Position updated every frame to stay anchored to descent point
- Direction shows steepest descent on XZ plane
- Uses `<primitive>` for full control over THREE object

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Browser Compatibility

- Modern browsers with WebGL support
- Tested on Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled

## Performance Considerations

- Mesh resolution: 100×100 grid points (adjustable in `meshGenerator.ts`)
- Animation frame rate: 60 FPS (controlled by `requestAnimationFrame`)
- Debounced custom function input to prevent excessive parsing
- Efficient gradient computation using analytic derivatives when available

## Future Enhancement Ideas

- [ ] Contour lines projected below surface
- [ ] Adjustable mesh resolution slider
- [ ] Color mapping based on function value (heatmap)
- [ ] Auto-camera following animated point
- [ ] Multiple descent points simultaneously
- [ ] Comparison mode (side-by-side optimizers)
- [ ] Export trajectory data (CSV/JSON)
- [ ] Save/load presets
- [ ] 3D contour surfaces (isosurfaces)
- [ ] Animation recording/playback
- [ ] Educational tooltips and explanations
- [ ] Mobile touch controls optimization

## Known Issues & Limitations

- Custom functions must use valid mathjs syntax
- Very steep functions may cause visual artifacts
- Unbounded functions (like Saddle Point) will diverge
- Gradient arrows only show horizontal component (XZ plane projection)

## Educational Value

This visualizer helps understand:
- How gradient descent finds minima
- Differences between optimization algorithms
- Impact of learning rate on convergence
- Behavior on different function landscapes
- Why some functions are harder to optimize
- Convergence vs divergence detection

## Credits

Built with:
- Next.js by Vercel
- React Three Fiber by Poimandres
- Three.js by Mr.doob
- mathjs by Jos de Jong
- shadcn/ui by shadcn