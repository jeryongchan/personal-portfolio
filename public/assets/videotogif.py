from moviepy.editor import VideoFileClip

videoClip = VideoFileClip("fiveCardsPlay.mp4")

videoClip.write_gif("fiveCardsPlay.gif")