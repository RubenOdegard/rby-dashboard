const TextTitle = (text: { title?: string }) => {
	return (
		<h3 className="text-pretty text-sm font-semibold">
			{text.title || "No title"}
		</h3>
	);
};

export default TextTitle;
