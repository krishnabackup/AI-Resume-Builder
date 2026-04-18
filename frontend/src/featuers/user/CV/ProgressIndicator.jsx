const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-wrapper">
      <p className="progress-text">
        Step {currentStep} of {totalSteps}
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}% ` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
