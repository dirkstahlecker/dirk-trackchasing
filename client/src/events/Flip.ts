export class Flip
{
	public flipId: string;
	public date: Date;
	public carClass: string;
	public rotations: string;
	public surface: string;
	public openWheel: boolean;
	public when: string;
	public video: boolean;
	public notes: string;

	constructor(flipId: string, date: Date, carClass: string, rotations: string, surface: string, openWheel: boolean, when: string, video: boolean, notes: string)
	{
		this.flipId = flipId;
		this.date = date;
		this.carClass = carClass;
		this.rotations = rotations;
		this.surface = surface;
		this.openWheel = openWheel;
		this.when = when;
		this.video = video;
		this.notes = notes;
	}
}
