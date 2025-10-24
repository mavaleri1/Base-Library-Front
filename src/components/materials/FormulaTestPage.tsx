import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { ArrowLeft } from 'lucide-react';
import { MarkdownViewer } from '../common';

const testContent = `# Testing Mathematical Formula Rendering

## Inline formulas

Speed of light in vacuum: $c = 3 \\times 10^8\\ m/s$

Newton's second law: $\\vec{F} = m \\vec{a}$

Energy: $E = mc^2$

Pythagorean theorem: $a^2 + b^2 = c^2`

## Display formulas

### Newton's second law (extended)

$$
\\vec{F} = m \\vec{a} = m \\frac{d\\vec{v}}{dt}
$$

### Schrödinger equation

$$
i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)
$$

### Euler's theorem

$$
e^{i\\pi} + 1 = 0
$$

### Quadratic equation

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

### Gaussian integral

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### Matrix

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

### System of equations

$$
\\begin{cases}
x + y = 5 \\\\
2x - y = 1
\\end{cases}
$$

## Complex examples

### Integral with limits

Area under the curve $f(x) = x^2$ from 0 to 1:

$$
\\int_0^1 x^2 dx = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{3}
$$

### Summation

Sum of the first $n$ natural numbers:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## Syntax highlighting

\`\`\`python
def calculate_energy(mass):
    c = 3e8  # speed of light
    return mass * c ** 2

print(calculate_energy(1))
\`\`\`

## Formula table

| Formula | Name | Application |
|---------|------|-------------|
| $E = mc^2$ | Einstein's | Rest energy |
| $F = ma$ | Newton's | Dynamics |
| $a^2 + b^2 = c^2$ | Pythagorean | Geometry |

---

**All formulas are rendered using KaTeX!** ✨`;

export const FormulaTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          icon={<ArrowLeft size={18} />}
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold text-ink">
          Formula Rendering Demo
        </h1>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Test Material with Mathematical Formulas</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <MarkdownViewer content={testContent} />
        </CardContent>
      </Card>
    </div>
  );
};


