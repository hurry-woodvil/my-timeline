import './background.css';

export default function Background() {
  return (
    <>
      <div aria-hidden="true" className="sandBg" />
      <div aria-hidden="true" className="sandDots" />
      <div aria-hidden="true" className="waveOverlay" />
    </>
  );
}
