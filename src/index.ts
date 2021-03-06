import LicenceChecker from 'license-checker';

async function generate() {
	const info = await getDepInfo();
	const infoToMd: string[] = Object.entries(info).map(([name, dep]: [string, LicenceChecker.ModuleInfo]) => {
		let res = `\n\n## ${name}`;
		if (dep.publisher) res += `\n- Published By: ${dep.publisher}`;
		if (dep.licenses) res += `\n- Licence: ${dep.licenses}`;
		if (dep.repository || dep.url) res += `\n- ${dep.repository || dep.url}`;

		return res;
	});

	return '# Included Works' + infoToMd.reduce((str: string, current: string) => str += current);
}

async function getDepInfo(): Promise<LicenceChecker.ModuleInfos> {
	return new Promise<LicenceChecker.ModuleInfos>((resolve, reject) => {
		opts: LicenceChecker.init({
			start: './',
			production: true
		}, (err: Error, info: LicenceChecker.ModuleInfos) => {
			if (err) reject(err);
			resolve(info);
		})
	});
}

generate()
	.then(md => console.log(md))
	.catch(err => console.error(`There was an error generating the file:\n${err}`));
