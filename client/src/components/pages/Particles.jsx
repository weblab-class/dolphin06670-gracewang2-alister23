/* This isn't important to functionality, but I just thought it might be cool to add some dynamic effects. */
import React from "react";
import { loadFull } from "tsparticles";
import { Particles } from "@tsparticles/react";
import "../../utilities.css";
import "./Particles.css";

const ParticlesComponent = () => {
  const particlesInit = async (main) => {
    // Load the tsparticles library bundle (required for full functionality)
    await loadFull(main);
  };

  return (
    <Particles
      className="particles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 100, // Number of particles
          },
          color: {
            value: "#705FBB", // Particle color (periwinkle)
          },
          links: {
            enable: true, // Enable connecting lines
            color: "EEEBFF", // Line color (lavender)
            distance: 150, // Distance between particles to connect
          },
          move: {
            enable: true, // Enable movement
            speed: 2, // Particle speed
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", // Particles repel when hovered over
            },
          },
          modes: {
            repulse: {
              distance: 100, // Distance for repulsion effect
            },
          },
        },
        background: {
          color: "#FFFFFF", // Background color (white)
        },
      }}
    />
  );
};

export default ParticlesComponent;
