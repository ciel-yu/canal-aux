package maya.components.amazon;

import java.util.concurrent.BlockingQueue;

public interface PumpService<T_QUEUE_IN, T_QUEUE_OUT> {

	public abstract BlockingQueue<T_QUEUE_IN> getInputQueue();

	public abstract BlockingQueue<T_QUEUE_OUT> getOutputQueue();

}