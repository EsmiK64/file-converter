import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Circle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StepperContextType = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepsCount: number;
  steps: React.ReactElement[];
  stepErrors: Record<number, string | null>;
  setStepErrors: React.Dispatch<
    React.SetStateAction<Record<number, string | null>>
  >;
  startTime: number;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper components must be used within a Stepper");
  }
  return context;
};

export const Stepper = ({
  children,
  onComplete,
}: {
  children: React.ReactNode;
  onComplete?: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<number, string | null>>(
    {}
  );
  const [startTime, setStartTime] = useState(Date.now());
  const steps = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === Stepper.Step
  );
  const stepsCount = steps.length;

  const contextValue = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      stepsCount,
      steps,
      stepErrors,
      setStepErrors,
      startTime,
      setStartTime,
    }),
    [currentStep, stepsCount, steps, stepErrors, startTime]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && currentStep < stepsCount - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (event.key === "ArrowLeft" && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    },
    [currentStep, stepsCount]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <StepperContext.Provider value={contextValue}>
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-secondary">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / (stepsCount - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <Stepper.Step key={index} {...step.props} index={index} />
            ))}
          </div>
        </div>

        <Stepper.Content />

        <Stepper.Navigation onComplete={onComplete} />
      </div>
    </StepperContext.Provider>
  );
};

Stepper.Step = ({
  title,
  description,
  index,
  children,
}: {
  title: string;
  description: string;
  index: number;
  children: React.ReactNode;
}) => {
  const { currentStep, stepErrors } = useStepperContext();

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          stepErrors[index]
            ? "bg-destructive text-destructive-foreground"
            : index <= currentStep
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
        initial={false}
        animate={{
          scale: index === currentStep ? 1.2 : 1,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${
              stepErrors[index]
                ? "error"
                : index <= currentStep
                ? "completed"
                : "uncompleted"
            }`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {stepErrors[index] ? (
              <AlertCircle className="w-5 h-5" />
            ) : index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="mt-2 text-sm font-medium text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.3 }}
      >
        {title}
      </motion.div>
      <motion.div
        className="mt-1 text-xs text-muted-foreground text-center max-w-[100px] hidden md:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
      >
        {description}
      </motion.div>
      {children}
    </div>
  );
};

Stepper.Content = () => {
  const { currentStep, steps, stepErrors } = useStepperContext();
  const currentChild = steps[currentStep];

  return (
    <motion.div
      initial={{ width: "100%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{currentChild.props.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentChild.props.children}
              {stepErrors[currentStep] && (
                <p className="mt-2 text-sm text-destructive">
                  {stepErrors[currentStep]}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

Stepper.Navigation = ({ onComplete }: { onComplete?: () => void }) => {
  const { currentStep, setCurrentStep, stepsCount, setStartTime } =
    useStepperContext();

  const handleNext = () => {
    if (currentStep < stepsCount - 1) {
      setCurrentStep(currentStep + 1);
      setStartTime(Date.now());
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setStartTime(Date.now());
    }
  };

  return (
    <div className="flex justify-between mt-4">
      <Button
        onClick={handlePrevious}
        disabled={currentStep === 0}
        variant="outline"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      <Button onClick={handleNext}>
        {currentStep === stepsCount - 1 ? "Finish" : "Next"}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
