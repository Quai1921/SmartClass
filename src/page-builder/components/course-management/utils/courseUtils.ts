// Utility function to generate unique gradient based on course ID
export const generateCourseGradient = (courseId: string): { background: string } => {
  // Create a simple hash from the course ID
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    const char = courseId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Define gradient color combinations with actual color values
  const gradients = [
    'linear-gradient(to bottom right, #2563eb, #9333ea)', // blue to purple
    'linear-gradient(to bottom right, #059669, #0d9488)', // green to teal
    'linear-gradient(to bottom right, #a855f7, #ec4899)', // purple to pink
    'linear-gradient(to bottom right, #eab308, #ea580c)', // yellow to orange
    'linear-gradient(to bottom right, #ef4444, #ec4899)', // red to pink
    'linear-gradient(to bottom right, #6366f1, #2563eb)', // indigo to blue
    'linear-gradient(to bottom right, #14b8a6, #059669)', // teal to green
    'linear-gradient(to bottom right, #f97316, #ef4444)', // orange to red
    'linear-gradient(to bottom right, #06b6d4, #2563eb)', // cyan to blue
    'linear-gradient(to bottom right, #10b981, #06b6d4)', // emerald to cyan
    'linear-gradient(to bottom right, #8b5cf6, #a855f7)', // violet to purple
    'linear-gradient(to bottom right, #f59e0b, #eab308)', // amber to yellow
    'linear-gradient(to bottom right, #f43f5e, #ef4444)', // rose to red
    'linear-gradient(to bottom right, #0ea5e9, #6366f1)', // sky to indigo
    'linear-gradient(to bottom right, #84cc16, #059669)', // lime to green
  ];
  
  // Use hash to select a gradient
  const index = Math.abs(hash) % gradients.length;
  return { background: gradients[index] };
};
