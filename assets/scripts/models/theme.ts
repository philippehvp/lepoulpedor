class Theme {
  id: number;
  label: string;
  link: string;
  subThemes: Array<SubTheme>;

  constructor(id: number, label: string, link: string, subThemes: Array<SubTheme>) {
    this.id = id;
    this.label = label;
    this.link = link;
    this.subThemes = subThemes;
  }
}

class SubTheme {
  public id: number;
  label: string;
  shortLabel: string;
  link: string;
  shortLink: string;

  constructor(id: number, label: string, shortLabel: string, link: string, shortLink: string) {
    this.id = id;
    this.label = label;
    this.shortLabel = shortLabel;
    this.link = link;
    this.shortLink = shortLink;
  }


}