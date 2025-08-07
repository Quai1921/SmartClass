import { useNavigate } from 'react-router';

interface Course {
    id?: string;
    title: string;
    description?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
    enrolledStudents?: number;
    rating?: number;
    tutorName?: string;
    subject?: string;
    banner?: string;
}

interface CourseCardProps {
    course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
    const navigate = useNavigate();

    const handleViewCourse = () => {
        // Navigate to course details or module management
        navigate(`/modules?courseId=${course.id}`);
    };

    return (
        <div 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleViewCourse}
        >
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {course.banner ? (
                        <img 
                            src={course.banner} 
                            alt={course.title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <span className="text-xl">📚</span>
                    )}
                </div>
                <div>
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">
                        {course.title}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-800' 
                                : course.status === 'IN_REVIEW'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                        </span>
                        {course.enrolledStudents !== undefined && (
                            <span>{course.enrolledStudents} estudiantes</span>
                        )}
                        {course.rating && course.rating > 0 && (
                            <span>⭐ {course.rating.toFixed(1)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver curso →
                </button>
            </div>
        </div>
    );
};
