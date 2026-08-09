import json, subprocess, sys, time, re
from concurrent.futures import ThreadPoolExecutor, as_completed

tools=json.load(open("audit/tools.json"))
results=[]

def check_one(tool):
    url=tool["website"]
    slug=tool["slug"]
    name=tool["name"]
    # curl head + follow, capture final url and status
    try:
        # use curl to get status and final url, plus content snippet for parking detection
        cmd=[
            "curl","-sL","-o","/tmp/curl_body_"+slug,
            "-w","%{http_code} %{url_effective} %{num_redirects}",
            "--connect-timeout","8",
            "--max-time","15",
            "-A","Mozilla/5.0 (ai-tools audit bot; +https://ai.vocino.com)",
            url
        ]
        proc=subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        out=proc.stdout.strip()
        parts=out.rsplit(" ",2) if out else ["","",""]
        # Actually format is http_code url_effective num_redirects -> need split carefully
        # format: "<code> <effective> <redirects>" but effective may contain spaces? no
        # So we used 3 tokens: code, effective, redirects (effective is single url no spaces)
        m=re.match(r'(\d+)\s+(\S+)\s+(\d+)', out)
        if m:
            code=int(m.group(1))
            final_url=m.group(2)
            redirects=int(m.group(3))
        else:
            code=0
            final_url=url
            redirects=0

        # read body snippet
        body=""
        try:
            with open("/tmp/curl_body_"+slug, "r", errors="ignore") as f:
                body=f.read(8000).lower()
        except:
            body=""

        # detect parking
        parked_keywords=["domain for sale","parked domain","hugedomains","buy this domain","this domain is parked","sedo.com","afternic","dan.com","bodis.com","parkingcrew"]
        is_parked=any(k in body for k in parked_keywords)

        # detect dead patterns in body/title
        dead_phrases=["404 not found","page not found","this site can’t be reached","account suspended","site not found"]
        # but status code is more authoritative

        # classify
        status="unknown"
        reason=""
        action="keep"
        alive=False

        if code==0:
            status="dead"
            reason="DNS/timeout/no response"
            action="review - likely dead"
            alive=False
        elif 200 <= code < 300:
            # check if parked despite 200
            if is_parked:
                status="parked"
                reason=f"200 but parked keywords detected, final {final_url}"
                action="remove - domain parked"
            elif final_url and final_url.rstrip('/') != url.rstrip('/') and redirects>0:
                # check if redirect to unrelated domain
                # extract domain
                import urllib.parse
                orig=urllib.parse.urlparse(url).netloc
                final=urllib.parse.urlparse(final_url).netloc
                if orig != final and final and orig not in final and final not in orig:
                    # allow common redirect e.g. www -> naked, or shorteners?
                    # if final is completely different TLD/service, flag
                    status="redirected"
                    reason=f"Redirects to unrelated domain {final} from {orig} ({code})"
                    action="review - possible acquisition or rebrand"
                    alive=True  # still alive but need review
                else:
                    status="alive"
                    reason=f"{code} -> {final_url} (redirects {redirects})"
                    alive=True
            else:
                status="alive"
                reason=f"{code} OK"
                alive=True
        elif 300 <= code < 400:
            # curl -L should have followed, but still 3xx suggests loop or blocked
            status="redirect"
            reason=f"{code} redirect loop / blocked to {final_url}"
            action="manual check"
        elif code==403 or code==429:
            status="alive"  # likely bot blocking but site exists
            reason=f"{code} blocked (likely alive, anti-bot)"
            alive=True
        elif 400 <= code < 500:
            status="dead"
            reason=f"{code} client error (404/410 likely dead)"
            action="remove / update"
        elif 500 <= code < 600:
            status="dead"
            reason=f"{code} server error"
            action="retry later, maybe dead"

        return {
            "slug": slug,
            "name": name,
            "website": url,
            "final_url": final_url,
            "code": code,
            "redirects": redirects,
            "status": status,
            "reason": reason,
            "action": action,
            "parked": is_parked,
            "alive": alive
        }
    except Exception as e:
        return {
            "slug": slug,
            "name": name,
            "website": url,
            "final_url": url,
            "code": 0,
            "redirects": 0,
            "status": "error",
            "reason": f"Exception {e}",
            "action": "review",
            "parked": False,
            "alive": False
        }

with ThreadPoolExecutor(max_workers=20) as ex:
    futures={ex.submit(check_one, t): t for t in tools}
    for i, fut in enumerate(as_completed(futures),1):
        r=fut.result()
        results.append(r)
        if i%20==0:
            print(f"checked {i}/{len(tools)}", flush=True)

# save
with open("audit/results.json","w") as f:
    json.dump(results,f,indent=2)

# summary
from collections import Counter
c=Counter([r["status"] for r in results])
print("\nSummary:", dict(c))
