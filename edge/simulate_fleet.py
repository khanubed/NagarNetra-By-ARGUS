import argparse
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

def simulate():
    parser = argparse.ArgumentParser(description="Fleet Simulator for NagarNetra Edge Units")
    parser.add_argument('--buses', type=int, default=12, help="Number of simulated buses")
    parser.add_argument('--speed', type=str, default='normal', choices=['slow', 'normal', 'fast'], help="Simulation speed")
    args = parser.parse_args()
    
    logging.info(f"Starting simulation of {args.buses} buses at {args.speed} speed...")
    
    try:
        while True:
            # Placeholder for telemetry emission logic (MQTT)
            time.sleep(5)
            logging.info("Heartbeat emitted from simulated fleet.")
    except KeyboardInterrupt:
        logging.info("Simulation stopped by user.")

if __name__ == '__main__':
    simulate()
