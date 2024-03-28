const TextDescription = (text: { description?: string }) => {
	return (
		<p className="text-pretty pt-1 text-base text-muted-foreground">
			{text.description || "No description"}
		</p>
	);
};

export default TextDescription;
