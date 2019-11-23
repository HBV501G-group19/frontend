import { useEffect, useRef } from "react";
export const useAutoScroll = (init: any, deps: any[]) => {
	const ref = useRef(init);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
				inline: "start"
			});
		}
	}, deps);

	return ref;
};
