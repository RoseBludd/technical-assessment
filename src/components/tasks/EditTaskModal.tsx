import { useState, useEffect } from "react";
import { IconX, IconEdit, IconCheck, IconPlus } from "@tabler/icons-react";
import { Task, TaskPriority, TaskStatus, TaskComplexity, TaskCategory } from "@/types/task";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
}

interface Department {
  name: string;
  display_name: string;
}

export const EditTaskModal = ({ task, onClose, onTaskUpdated }: EditTaskModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [complexity, setComplexity] = useState<TaskComplexity>(task.complexity);
  const [category, setCategory] = useState<TaskCategory>(task.category || "NEW_FEATURE");
  const [department, setDepartment] = useState<string>(task.department);
  const [compensation, setCompensation] = useState<string>(task.compensation.toString());
  const [estimatedTime, setEstimatedTime] = useState<string>(task.estimated_time.toString());
  const [requirements, setRequirements] = useState<string[]>(task.requirements || []);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(task.acceptance_criteria || []);
  
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analyzedTask, setAnalyzedTask] = useState<{
    title: string;
    optimizedDescription: string;
    requirements: string[];
    acceptanceCriteria: string[];
    suggestedCompensation: number;
    estimatedTime: number;
  } | null>(null);

  useEffect(() => {
    // Fetch departments when component mounts
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/admin/departments');
        if (response.ok) {
          const data = await response.json();
          setDepartmentsList(data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrorMessage("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      // Analyze the task description
      const analysisResponse = await fetch("/api/admin/tasks/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze task");
      }

      const analysisData = await analysisResponse.json();
      setAnalyzedTask(analysisData);
    } catch (error) {
      console.error("Error analyzing task:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to analyze task");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setErrorMessage(null);
    
    try {
      // Use either the analyzed task data or the manually edited data
      const updatedTaskData = {
        id: task.id,
        title: analyzedTask ? analyzedTask.title : title,
        description: analyzedTask ? analyzedTask.optimizedDescription : description,
        priority,
        status,
        complexity,
        category,
        department,
        compensation: parseFloat(compensation),
        estimated_time: parseInt(estimatedTime),
        requirements: analyzedTask ? analyzedTask.requirements : requirements,
        acceptance_criteria: analyzedTask ? analyzedTask.acceptanceCriteria : acceptanceCriteria,
      };

      const updateResponse = await fetch(`/api/admin/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements.splice(index, 1);
    setRequirements(updatedRequirements);
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const updatedCriteria = [...acceptanceCriteria];
    updatedCriteria[index] = value;
    setAcceptanceCriteria(updatedCriteria);
  };

  const handleAddCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, ""]);
  };

  const handleRemoveCriteria = (index: number) => {
    const updatedCriteria = [...acceptanceCriteria];
    updatedCriteria.splice(index, 1);
    setAcceptanceCriteria(updatedCriteria);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-gray-800 rounded-xl p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 mb-4 text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Manual Edit Form */}
          {!analyzedTask && (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complexity
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as TaskComplexity)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="NEW_FEATURE">New Feature</option>
                    <option value="BUG_FIX">Bug Fix</option>
                    <option value="INTEGRATION">Integration</option>
                    <option value="AUTOMATION">Automation</option>
                    <option value="OPTIMIZATION">Optimization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {departmentsList.map((dept) => (
                      <option key={dept.name} value={dept.name}>
                        {dept.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Compensation ($)
                  </label>
                  <input
                    type="number"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Time (hours)
                  </label>
                  <input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requirements
                </label>
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="ml-2 text-gray-400 hover:text-red-400"
                    >
                      <IconX size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="mt-2 px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 flex items-center text-sm"
                >
                  <IconPlus size={16} className="mr-1" /> Add Requirement
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Acceptance Criteria
                </label>
                {acceptanceCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={criteria}
                      onChange={(e) => handleCriteriaChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCriteria(index)}
                      className="ml-2 text-gray-400 hover:text-red-400"
                    >
                      <IconX size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCriteria}
                  className="mt-2 px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 flex items-center text-sm"
                >
                  <IconPlus size={16} className="mr-1" /> Add Acceptance Criteria
                </button>
              </div>
            </form>
          )}

          {/* NLP Analysis Section */}
          <div className="border-t border-gray-700 pt-6">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Analyze Task with AI
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the task in detail to analyze with AI and generate requirements..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-32"
                  disabled={isAnalyzing}
                />
              </div>
              <button
                type="submit"
                disabled={!description.trim() || isAnalyzing}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Task"
                )}
              </button>
            </form>
          </div>

          {/* Analysis Results */}
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="text-gray-300">Analyzing task and generating requirements...</p>
            </div>
          ) : analyzedTask ? (
            <div className="space-y-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Analysis Results</h3>
                <div className="mb-4">
                  <span className="text-sm text-gray-400">Title:</span>
                  <p className="text-white font-medium">{analyzedTask.title}</p>
                </div>
                <div className="text-gray-300">{analyzedTask.optimizedDescription}</div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Key Requirements</h4>
                  <ul className="space-y-2">
                    {analyzedTask.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span className="text-gray-300 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Acceptance Criteria</h4>
                  <ul className="space-y-2">
                    {analyzedTask.acceptanceCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span className="text-gray-300 text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-sm text-gray-400">Compensation</span>
                    <p className="text-xl font-semibold text-white">${analyzedTask.suggestedCompensation}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Est. Time</span>
                    <p className="text-xl font-semibold text-white">{analyzedTask.estimatedTime}h</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <IconCheck size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 