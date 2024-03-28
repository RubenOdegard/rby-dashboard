const TextDescription = (text: { description?: string }) => {
	return (
		<p className="text-pretty pt-2 text-xs text-muted-foreground">
			{text.description || "No description"}
		</p>
	);
};

export default TextDescription;
